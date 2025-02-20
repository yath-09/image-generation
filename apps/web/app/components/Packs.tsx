import { BACKEND_URL } from "@/app/config";
import { TPack } from "./PacksClient";
import axios from "axios";
import { PacksClient } from "./PacksClient"
import { useEffect } from "react";

async function getPacks(): Promise<TPack[]> {
  const res = await axios.get(`${BACKEND_URL}/pack/bulk`);
  return res.data.packs ?? [];
}

export default function Packs() {
  //const packs = await getPacks();
 
   //console.log(packs);
  return <PacksClient/>;
}