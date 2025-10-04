import { GenerateImage } from "common/types";
import { z } from "zod";
import { prismaClient } from "db";
import { FalAiModel } from "../../models/FalAiModel";

const falAiModel = new FalAiModel();
const IMAGE_GENERATION_CREDITS = 1;

export class GenerationService {
    static async generateImage(data: z.infer<typeof GenerateImage>, userId: string) {
        const model = await prismaClient.model.findUnique({
            where: {
                id: data.modelId,
            }
        });

        if (!model || !model.tensorPath) {
            throw new Error("Model not found");
        }

        // Check with the credits for the user to generate image 
        const credits = await prismaClient.userCredit.findUnique({
            where: {
                userId: userId,
            }
        });

        if ((credits?.amount || 0) < IMAGE_GENERATION_CREDITS) {
            throw new Error("Not enough credits");
        }

        const { request_id, response_url } = await falAiModel.generateImage(data.prompt, model?.tensorPath);

        const imageData = await prismaClient.outputImages.create({
            data: {
                prompt: data.prompt,
                modelId: data.modelId,
                userId: userId,
                status: "PENDING",
                falAiRequestId: request_id,
            }
        });

        await prismaClient.userCredit.update({
            where: {
                userId: userId,
            },
            data: {
                amount: { decrement: IMAGE_GENERATION_CREDITS },
            },
        });

        return { imageId: imageData.id };
    }
}
