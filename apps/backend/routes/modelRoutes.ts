import { Router } from "express";
import { ModelService } from "../services/model/modelService";
import { authMiddleware } from "../middleware";

const router = Router();

// Get user models
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await ModelService.getUserModels(req.userId!);
        res.json(result);
    } catch (error) {
        console.error("Get models error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
