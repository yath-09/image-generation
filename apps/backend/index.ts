import express from "express";
import { TrainModel, GenerateImage, GenerateImagesFromPack } from "common/types";
import { prismaClient } from "db";
import {s3,write,S3Client} from "bun"
import { FalAiModel } from "./models/FalAiModel";
const port = process.env.PORT || 8080;
const app = express();
const USER_ID = "123";


const falAiModel=new FalAiModel();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Healthy server");
});

app.get("/health", (req, res) => {
  res.send("Healthy server");
});

app.post("/ai/training", async (req, res) => {
  const parsedBody = TrainModel.safeParse(req.body);
  const images=req.body.images;
  if (!parsedBody.success) {
    res.status(411).json({ message: "Input incorrect" });
    return;
  }

  const {request_id,response_url}=await falAiModel.trainModel("",parsedBody.data.name);
  const data = await prismaClient.model.create({
    data: {
      name: parsedBody.data.name,
      type: parsedBody.data.type,
      age: parsedBody.data.age,
      ethinicity: parsedBody.data.ethinicity,
      eyeColor: parsedBody.data.eyeColor,
      bald: parsedBody.data.bald,
      userId: USER_ID,
      falAiRequestId: request_id,
    }
  });
  res.status(200).json({ modelId: data.id });
});

app.post("/ai/generate", async (req, res) => {
  const parsedBody = GenerateImage.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({ message: "Input incorrect" });
    return;
  }
  const model=await prismaClient.model.findUnique({
    where:{
      id:parsedBody.data.modelId,
    }
  })

  if(!model || !model.tensorPath){
    res.status(404).json({ message: "Model not found" });
    return;
  }
  const {request_id,response_url}=await falAiModel.generateImage(parsedBody.data.prompt,model?.tensorPath);

  const data = await prismaClient.outputImages.create({
    data: {
      prompt: parsedBody.data.prompt,
      modelId: parsedBody.data.modelId,
      userId: USER_ID,
      status: "PENDING",
      falAiRequestId: request_id,
    }
  })

  res.status(200).json({
    imageId: data.id,
  });
});

app.post("/pack/generate", async (req, res) => {
  const parsedBody = GenerateImagesFromPack.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({ message: "Input incorrect" });
    return;
  }

  const promts = await prismaClient.packPrompts.findMany({
    where: {
      prompt: parsedBody.data.packId,
    }
  })
  const images = await prismaClient.outputImages.createManyAndReturn({
    data: promts.map((prompt) => ({
      prompt: prompt.prompt,
      modelId: parsedBody.data.modelId,
      userId: USER_ID,
      status: "PENDING",
    }))
  })
  res.status(200).json({
    images: images.map((image) => image.id),
  })
});


app.get("/pack/bulk", async (req, res) => {
  const packs = await prismaClient.packs.findMany({})
  res.status(200).json({
    packs
  })
});
app.get("/image/bulk", async (req, res) => {
  const ids = req.query.images as string[];

  const limit = req.query.limit as string || "10";
  const offset = req.query.offset as string || "0";
  const imagesData = await prismaClient.outputImages.findMany({
    where: {
      id: {
        in: ids,
      },
      userId: USER_ID,
    },
    skip: parseInt(offset),
    take: parseInt(limit),
  });
  res.status(200).json({
    images: imagesData,
  })
});

app.post("/fal-ai/webhook/train", async (req, res) => {
  console.log(req.body);
  const requestId = req.body.request_id;
  if (!requestId) {
    res.status(400).json({
      message: "Request ID is required",
    })
    return;
  }
  await prismaClient.model.updateMany({
    where: {
      falAiRequestId: requestId as string,
    },
    data: {
      tensorPath: req.body.tensor_path,
      trainingStatus: "GENERATED",
    }

  })
  res.status(200).json({
    message: "Webhook received",
  })
})


app.post("/fal-ai/webhook/image", async (req, res) => {
  console.log(req.body);
  const requestId = req.body.request_id;
 
  await prismaClient.outputImages.updateMany({
    where: {
      falAiRequestId: requestId as string,
    },
    data: {
      status: "GENERATED",
      imageUrl: req.body.image_url,
    }
  })
  res.status(200).json({
    message: "Webhook received",
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})