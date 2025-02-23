import express from "express";
import { TrainModel, GenerateImage, GenerateImagesFromPack } from "common/types";
import { prismaClient } from "db";
import {s3,write,S3Client} from "bun"
import { FalAiModel } from "./models/FalAiModel";
const port = process.env.PORT || 8080;
const app = express();

import cors from "cors";
import { authMiddleware } from "./middleware";
import { fal } from "@fal-ai/client";

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


  let requestIds:{request_id:string}[]=await Promise.all(prompts.map((prompt) => falAiModel.generateImage(prompt.prompt,parsedBody.data.modelId)))
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
      OR: [{ userId: req.userId },{ open: true }],
    },
  });
  // console.log(models)
  res.json({
    models,
  });
});

app.post("/fal-ai/webhook/train", async (req, res) => {
  console.log(req.body);

  //this the request id given by the falai when hitting our webhook
  const requestId = req.body.request_id as string;
 

  const result = await fal.queue.result("fal-ai/flux-lora", {
    requestId,
  });
   //creating the thumbnail for the midel taht is there 
  const { imageUrl } = await falAiModel.generateModelThumbnail(
    result.data?.diffusers_lora_file.url
  );


  await prismaClient.model.updateMany({
    where: {
      falAiRequestId: requestId as string,
    },
    data: {
      tensorPath: result.data?.diffusers_lora_file.url,
      thumbnail: imageUrl,
      trainingStatus: "GENERATED",
    }

  })
  res.status(200).json({
    message: "Webhook received",
  })
})


app.post("/fal-ai/webhook/image", async (req, res) => {
  console.log("/fal-ai/webhook/image");
  console.log(req.body)
  const requestId = req.body.request_id;

  //if error comes from the falai 
  if (req.body.status === "ERROR") {
    res.status(411).json({});
    prismaClient.outputImages.updateMany({
      where: {
        falAiRequestId: requestId,
      },
      data: {
        status: "FAILED",
        imageUrl: req.body.payload.images[0].url,
      },
    });
    return;
  }
  //if sucesfull
  await prismaClient.outputImages.updateMany({
    where: {
      falAiRequestId: requestId as string,
    },
    data: {
      status: "GENERATED",
      imageUrl: req.body.payload.images[0].url,
    }
  })
  res.status(200).json({
    message: "Webhook received from the /image",
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})