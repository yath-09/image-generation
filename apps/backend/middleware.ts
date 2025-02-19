import type { NextFunction ,Response,Request} from "express";

import jwt from "jsonwebtoken"

export function authMiddleware(req:Request,res:Response,next:NextFunction){
    const authHeader=req.headers["authorization"];
    const token=authHeader?.split(" ")[1];

    try {
        //console.log(token)
        const decoded=jwt.decode(token!, process.env.AUTH_JWT_KEY!,{
            algorithms:['RS256']
        })
        //console.log(decoded)
        if(decoded?.sub){
            next()
            req.userId=decoded?.sub
        }
        else {
            console.log("heheh")
        }
    } catch (e) {
        res.status(403).json({
            message:"Error"
        })
    }
}