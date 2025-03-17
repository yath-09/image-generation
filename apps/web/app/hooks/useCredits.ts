import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "../config";
import useSWR from "swr";
import axios from "axios";

export function useCredit() {
  const { getToken } = useAuth();

  const fetchCredits = async () => {
    const token = await getToken();
    if (!token) return 0;

    const response = await axios.get(`${BACKEND_URL}/user/credit`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data?.credits || 0;
  };

  const { data: credits, error, mutate } = useSWR("/user/credit", fetchCredits, {
    revalidateOnFocus: false, // Don't re-fetch when tab is focused
  });

  return {
    credits: credits ?? 0,
    loading: !credits && !error,
    refreshCredits: mutate, // Call this after a successful transaction
  };
}
