import { Router } from "express";
import { StorageService } from "../services/storage/storageService";

const router = Router();

// Generate presigned URL for file upload
router.get("/presigned-url", async (req, res) => {
    try {
        const result = await StorageService.generatePresignedUrl();
        res.json(result);
    } catch (error) {
        console.error("Presigned URL error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
