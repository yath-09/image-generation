"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { PacksClient } from "./PacksClient";
import { TPack } from "./PackCard";

export default function Packs() {
    const [packs, setPacks] = useState<TPack[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false); 

    useEffect(() => {
        if (hasFetched) return; 

        (async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/pack/bulk`);
                setPacks(response.data.packs ?? []);
                setHasFetched(true); // Set flag to prevent refetch
            } catch (error) {
                console.error("Error fetching packs:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [hasFetched]); // Depend on `hasFetched` to avoid infinite calls

    return <PacksClient packs={packs} loading={loading} />;
}
