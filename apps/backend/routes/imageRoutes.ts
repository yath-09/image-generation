import { Router } from "express";
import { ImageService } from "../services/image/imageService";
import { authMiddleware } from "../middleware";

const router = Router();

// Get bulk images
router.get("/bulk", authMiddleware, async (req, res) => {
    try {
        const ids = req.query.ids as string[];
        const limit = req.query.limit as string || "10";
        const pageNumber = req.query.pageNumber as string || "1";

        const result = await ImageService.getBulkImages(ids, req.userId!, limit, pageNumber);
        res.status(200).json(result);
    } catch (error) {
        console.error("Get images error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
