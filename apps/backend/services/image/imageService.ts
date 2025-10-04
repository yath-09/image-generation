import { prismaClient } from "db";

export class ImageService {
    static async getBulkImages(ids: string[], userId: string, limit: string = "20", offset: string = "0") {
        const imagesData = await prismaClient.outputImages.findMany({
            where: {
                id: {
                    in: ids,
                },
                userId: userId,
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

        return {
            images: imagesData.map(({ falAiRequestId, modelId, prompt, userId, updatedAt, ...rest }) => rest),
        };
    }
}
