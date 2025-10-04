import { Router } from "express";
import { TrainModel, GenerateImage } from "common/types";
import { TrainingService } from "../services/ai/trainingService";
import { GenerationService } from "../services/ai/generationService";
import { authMiddleware } from "../middleware";

const router = Router();

// AI Training route
router.post("/training", authMiddleware, async (req, res) => {
    try {
        const parsedBody = TrainModel.safeParse(req.body);

        if (!parsedBody.success) {
            res.status(411).json({ message: "Input incorrect" });
            return;
        }

        const result = await TrainingService.trainModel(parsedBody.data, req.userId!);
        res.status(200).json(result);
    } catch (error) {
        console.error("Training error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// AI Generate route
router.post("/generate", authMiddleware, async (req, res) => {
    try {
        const parsedBody = GenerateImage.safeParse(req.body);

        if (!parsedBody.success) {
            res.status(411).json({ message: "Input incorrect" });
            return;
        }

        const result = await GenerationService.generateImage(parsedBody.data, req.userId!);
        res.status(200).json(result);
    } catch (error) {
        console.error("Generation error:", error);

        if (error instanceof Error) {
            if (error.message === "Model not found") {
                res.status(404).json({ message: error.message });
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

export default router;
