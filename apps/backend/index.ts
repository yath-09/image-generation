import express from "express";
import cors from "cors";

// Import route modules
import healthRoutes from "./routes/healthRoutes";
import storageRoutes from "./routes/storageRoutes";
import aiRoutes from "./routes/aiRoutes";
import packRoutes from "./routes/packRoutes";
import imageRoutes from "./routes/imageRoutes";
import modelRoutes from "./routes/modelRoutes";
import userRoutes from "./routes/userRoutes";

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/", healthRoutes);
app.use("/", storageRoutes);
app.use("/ai", aiRoutes);
app.use("/pack", packRoutes);
app.use("/image", imageRoutes);
app.use("/models", modelRoutes);
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})