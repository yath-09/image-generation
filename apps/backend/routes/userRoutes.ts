import { Router } from "express";
import { UserService } from "../services/user/userService";
import { authMiddleware } from "../middleware";

const router = Router();

// Get user credits
router.get("/credit", authMiddleware, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const result = await UserService.getUserCredits(req.userId);
        res.json(result);
    } catch (error) {
        console.error("Error fetching credits:", error);
        res.status(500).json({
            message: "Error fetching credits",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;
