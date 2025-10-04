import { GenerateImagesFromPack } from "common/types";
import { z } from "zod";
import { prismaClient } from "db";
import { FalAiModel } from "../../models/FalAiModel";

const falAiModel = new FalAiModel();
const IMAGE_GENERATION_CREDITS = 1;

export class PackService {
    static async generateImagesFromPack(data: z.infer<typeof GenerateImagesFromPack>, userId: string) {
        const prompts = await prismaClient.packPrompts.findMany({
            where: {
                packId: data.packId,
            }
        });

        const model = await prismaClient.model.findFirst({
            where: {
                id: data.modelId,
            },
        });

        if (!model) {
            throw new Error("Model not found");
        }

        // Check with the credits for the user to generate image in packs
        const credits = await prismaClient.userCredit.findUnique({
            where: {
                userId: userId,
            }
        });

        if ((credits?.amount || 0) < (IMAGE_GENERATION_CREDITS * prompts.length)) {
            throw new Error("Not enough credits");
        }

        let requestIds: { request_id: string }[] = await Promise.all(
            prompts.map((prompt) => falAiModel.generateImage(prompt.prompt, model?.tensorPath || ""))
        );

        const images = await prismaClient.outputImages.createManyAndReturn({
            data: prompts.map((prompt, index) => ({
                prompt: prompt.prompt,
                modelId: data.modelId,
                userId: userId,
                status: "PENDING",
                imageUrl: "",
                falAiRequestId: requestIds[index].request_id,
            }))
        });

        // If the request fails it will be handled by webhooks this is to prevent attacks with simultaneous requests
        await prismaClient.userCredit.update({
            where: {
                userId: userId,
            },
            data: {
                amount: { decrement: IMAGE_GENERATION_CREDITS * prompts.length },
            },
        });

        return { images: images.map((image) => image.id) };
    }

    static async getAllPacks() {
        const packs = await prismaClient.packs.findMany({});
        return { packs };
    }
}
