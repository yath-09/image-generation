import express from "express";
import { TrainModel, GenerateImage, GenerateImagesFromPack } from "common/types";
import { prismaClient } from "db";
import {S3Client} from "bun"
import { FalAiModel } from "./models/FalAiModel";
const port = process.env.PORT || 8080;
const app = express();

import cors from "cors";
import { authMiddleware } from "./middleware";

const IMAGE_GENERATION_CREDITS=1;
const TRAIN_GENERATION_CREDITS=10;

const falAiModel=new FalAiModel();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Healthy server");
});

app.get("/health", (req, res) => {
  res.send("Healthy server");
});

app.get("/presigned-url", async (req, res) => {
  const key=`models/${Date.now()}_${Math.random()}.zip`;
  const url =S3Client.presign(key, {
    method:"PUT",
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT,
    bucket: process.env.S3_BUCKET_NAME,
    expiresIn: 60 * 5,
    type:"application/zip"
  });
  res.json({url,key});
});

app.post("/ai/training",authMiddleware, async (req, res) => {
  const parsedBody = TrainModel.safeParse(req.body);
  //console.log(parsedBody.error)
  //const images=req.body.images;
  if (!parsedBody.success) {
    res.status(411).json({ message: "Input incorrect" });
    return;
  }

  const {request_id,response_url}=await falAiModel.trainModel(parsedBody.data.zipUrl,parsedBody.data.name);
  const data = await prismaClient.model.create({
    data: {
      name: parsedBody.data.name,
      type: parsedBody.data.type,
      age: parsedBody.data.age,
      ethinicity: parsedBody.data.ethinicity,
      eyeColor: parsedBody.data.eyeColor,
      bald: parsedBody.data.bald,
      userId: req.userId!,
      zipUrl:parsedBody.data.zipUrl,
      falAiRequestId: request_id, //curnetl been set to "" to prevent the fal ai pricing 
    }
  });
  res.status(200).json({ modelId: data.id });
});

app.post("/ai/generate",authMiddleware, async (req, res) => {
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

  //check  with the credits for the user to generate image 
  const credits=await prismaClient.userCredit.findUnique(
    {
      where:{
        userId:req.userId!,
      }
    }
  );

  if((credits?.amount || 0)<IMAGE_GENERATION_CREDITS){
    res.status(402).json({
      message:"Not enough credits",
    })
    return;
  }

  const {request_id,response_url}=await falAiModel.generateImage(parsedBody.data.prompt,model?.tensorPath);

  const data = await prismaClient.outputImages.create({
    data: {
      prompt: parsedBody.data.prompt,
      modelId: parsedBody.data.modelId,
      userId: req.userId!,
      status: "PENDING",
      falAiRequestId: request_id,
    }
  })
  await prismaClient.userCredit.update({
    where: {
      userId: req.userId!,
    },
    data: {
      amount: { decrement: IMAGE_GENERATION_CREDITS },
    },
  });

  res.status(200).json({
    imageId: data.id,
  });
});

app.post("/pack/generate",authMiddleware, async (req, res) => {
  const parsedBody = GenerateImagesFromPack.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({ message: "Input incorrect" });
    return;
  }
  //console.log(parsedBody.data.packId)

  const prompts = await prismaClient.packPrompts.findMany({
    where: {
      packId: parsedBody.data.packId,
    }
  })
  //console.log(prompts)
  const model = await prismaClient.model.findFirst({
    where: {
      id: parsedBody.data.modelId,
    },
  });

  if (!model) {
    res.status(411).json({
      message: "Model not found",
    });
    return;
  }


  //check  with the credits for the user to generate image in packs
  const credits=await prismaClient.userCredit.findUnique(
    {
      where:{
        userId:req.userId!,
      }
    }
  );

  if((credits?.amount || 0)<(IMAGE_GENERATION_CREDITS*prompts.length)){
    res.status(402).json({
      message:"Not enough credits",
    })
    return;
  }


  let requestIds:{request_id:string}[]=await Promise.all(prompts.map((prompt) => falAiModel.generateImage(prompt.prompt,model?.tensorPath || "")))
  //console.log(requestIds)
  const images = await prismaClient.outputImages.createManyAndReturn({
    data: prompts.map((prompt,index) => ({
      prompt: prompt.prompt,
      modelId: parsedBody.data.modelId,
      userId: req.userId!,
      status: "PENDING",
      imageUrl:"",
      falAiRequestId: requestIds[index].request_id,
    }))
  })
  //if the request fails it will be handled by webhooks this is to prevent attacks with simalutanusy
  await prismaClient.userCredit.update({
    where: {
      userId: req.userId!,
    },
    data: {
      amount: { decrement: IMAGE_GENERATION_CREDITS * prompts.length },
    },
  });

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

//getting the generated images
app.get("/image/bulk",authMiddleware, async (req, res) => {
  const ids = req.query.ids as string[];

  const limit = req.query.limit as string || "20";
  const offset = req.query.offset as string || "0";

  const imagesData = await prismaClient.outputImages.findMany({
    where: {
      id: {
        in: ids,
      },
      userId: req.userId!,
      status: {
        not: "FAILED"
      },
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip: parseInt(offset),
    take: parseInt(limit),
  });
  res.status(200).json({
    images: imagesData.map(({ falAiRequestId, modelId, prompt, userId, updatedAt, ...rest }) => rest),
});

});


app.get("/models", authMiddleware, async (req, res) => {
  const models = await prismaClient.model.findMany({
    where: {
      OR: [{ userId: req.userId },{ open: true }],//open for globaly avaialable 
    },
  });
  // console.log(models)
  res.json({
    models:models.map(
     (({ falAiRequestId, tensorPath,zipUrl,type,age,eyeColor,bald,userId,ethinicity ,updatedAt, triggerWord,...rest }) => rest)
    ),
  });
});

// Add this route to get user credits
app.get(
  "/user/credit",
  authMiddleware,
  async (req,res) => {
    try {
      if (!req.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      //console.log(req.userId)

      const userCredit = await prismaClient.userCredit.findUnique({
        where: {
          userId: req.userId,
        },
        select: {
          amount: true,
        },
      });

      res.json({
        credits: userCredit?.amount || 0,
      });
      return;
    } catch (error) {
      console.error("Error fetching credits:", error);
      res.status(500).json({
        message: "Error fetching credits",
        details: error instanceof Error ? error.message : "Unknown error",
      });
      return;
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})