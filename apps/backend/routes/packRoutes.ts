import { Router } from "express";
import { GenerateImagesFromPack } from "common/types";
import { PackService } from "../services/pack/packService";
import { authMiddleware } from "../middleware";

const router = Router();

// Generate images from pack
router.post("/generate", authMiddleware, async (req, res) => {
    try {
        const parsedBody = GenerateImagesFromPack.safeParse(req.body);

        if (!parsedBody.success) {
            res.status(411).json({ message: "Input incorrect" });
            return;
        }

        const result = await PackService.generateImagesFromPack(parsedBody.data, req.userId!);
        res.status(200).json(result);
    } catch (error) {
        console.error("Pack generation error:", error);

        if (error instanceof Error) {
            if (error.message === "Model not found") {
                res.status(411).json({ message: error.message });
                return;
            }
            if (error.message === "Not enough credits") {
                res.status(402).json({ message: error.message });
                return;
            }
        }

        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all packs
router.get("/bulk", async (req, res) => {
    try {
        const result = await PackService.getAllPacks();
        res.status(200).json(result);
    } catch (error) {
        console.error("Get packs error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
