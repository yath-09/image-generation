
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";
import axios from "axios";

export function useCredit(){
    const {getToken}=useAuth();
    const [credits,setCredits]=useState(0);
    const [loading, setLoading] = useState(true);

    const fetchCredits = async () => {
        try {
          setLoading(true);
          const token = await getToken();
          if (!token) return;
    
          const response = await axios.get(`${BACKEND_URL}/user/credit`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (response.data) {
            setCredits(response?.data?.credits || 0);
          }
        } catch (error) {
          console.error("Error fetching credits:", error);
        } finally {
          setLoading(false);
        }
    };

    useEffect(()=>{
        fetchCredits()
    },[])

    return {credits,loading};
}