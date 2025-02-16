import express from "express";
import { TrainModel, GenerateImage, GenerateImagesFromPack } from "common/types";
import {prismaClient} from "db";

const port = process.env.PORT || 8080;
const app = express();
const USER_ID = "123";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Healthy server");
});

app.get("/health", (req, res) => {
  res.send("Healthy server");
});

app.post("/ai/training", async (req, res) => {
  const parsedBody = TrainModel.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({ message: "Input incorrect" });
    return;
  }
  const data=await prismaClient.model.create({
    data:{
      name: parsedBody.data.name,
      type: parsedBody.data.type,
      age: parsedBody.data.age,
      ethinicity: parsedBody.data.ethinicity,
      eyeColor: parsedBody.data.eyeColor,
      bald: parsedBody.data.bald,
      userId: USER_ID,
    }
  });
  res.status(200).json({modelId: data.id});
});

app.post("/ai/generate", async (req, res) => {
  const parsedBody = GenerateImage.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({ message: "Input incorrect" });
    return;
  }

  // const model = await prismaClient.model.findUnique({
  //   where: {
  //     id: parsedBody.data.modelId,
  //     userId: USER_ID
  //   }
  // });

  // if (!model) {
  //   res.status(404).json({ message: "Model not found" });
  //   return;
  // }

  const data=await prismaClient.outputImages.create({
    data:{
      prompt: parsedBody.data.prompt,
      modelId: parsedBody.data.modelId,
      userId: USER_ID,
      status: "PENDING",
    }
  })

  res.status(200).json({
    imageId: data.id,
  });
});

app.post("/pack/generate", async (req, res) => {
    const parsedBody=GenerateImagesFromPack.safeParse(req.body);
    if(!parsedBody.success){
        res.status(411).json({message: "Input incorrect"});
        return;
    }

    const promts=await prismaClient.packPrompts.findMany({
        where:{
            prompt: parsedBody.data.packId,
        }
    })
    const images=await prismaClient.outputImages.createManyAndReturn({
        data:promts.map((prompt)=>({
            prompt:prompt.prompt,
            modelId:parsedBody.data.modelId,
            userId:USER_ID,
            status:"PENDING",
        }))
    })
    res.status(200).json({
        images:images.map((image)=>image.id),
    })
});


app.get("/pack/bulk",async (req, res) => {
  
   const packs=await prismaClient.packs.findMany({})
    res.status(200).json({
        packs
    })
});
app.get("/image/bulk", async(req, res) => {
  const ids=req.query.images as string[];
  
  const limit=req.query.limit as string || "10";
  const offset=req.query.offset as string || "0";
  const imagesData=await prismaClient.outputImages.findMany({ 
    where:{
      id:{
        in:ids,
      },
      userId:USER_ID,
    },
    skip:parseInt(offset),
    take:parseInt(limit),
  });
  res.status(200).json({
    images:imagesData,
  })
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})