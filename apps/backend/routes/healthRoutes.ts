import { Router } from "express";

const router = Router();

// Health check routes
router.get("/", (req, res) => {
    res.send("Healthy server");
});

router.get("/health", (req, res) => {
    res.send("Healthy server");
});

export default router;
