// import { clerkClient } from "@clerk/clerk-sdk-node";
import {clerkClient} from "@clerk/express"
import type { NextFunction ,Response,Request} from "express";

import jwt from "jsonwebtoken"
declare global {
    namespace Express {
      interface Request {
        userId?: string;
        user?: {
          email: string;
        };
      }
    }
  }

export async function authMiddleware(req:Request,res:Response,next:NextFunction){
    const authHeader=req.headers["authorization"];
    const token=authHeader?.split(" ")[1];
    try {
        //console.log(token)
        const formattedKey = (process.env.AUTH_JWT_KEY)!.replace(/\\n/g, "\n");
        // console.log(formattedKey)
        const decoded=jwt.verify(token!, formattedKey,{
            algorithms:['RS256'],
            complete:true,
        })
        //console.log(decoded)
        const userId = (decoded as any).payload.sub;
        if (!userId) {
            console.error("No user ID in token payload");
            res.status(403).json({ message: "Invalid token payload" });
            return;
          }
        const user = await clerkClient.users.getUser(userId);
        // console.log(user)
        const primaryEmail = user.emailAddresses.find(
            (email) => email.id === user.primaryEmailAddressId
          );
      
          if (!primaryEmail) {
            console.error("No email found for user");
            res.status(400).json({ message: "User email not found" });
            return;
          }
        if(decoded?.payload){
            req.userId=userId;
            req.user={
                email:primaryEmail.emailAddress
            };
            next()
            //req.userId=decoded?.sub
        }
        else {
            console.log("heheh")
        }
    } catch (e) {
        console.log(e)
        res.status(403).json({
            message:"Error"
        })
    }
}