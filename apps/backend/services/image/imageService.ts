import { prismaClient } from "db";

export class ImageService {
    static async getBulkImages(ids: string[], userId: string, limit: string = "10", pageNumber: string = "1") {
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
            skip: (parseInt(pageNumber, 10) - 1) * parseInt(limit, 10),
            take: parseInt(limit, 10),
        });

        return {
            images: imagesData.map(({ falAiRequestId, modelId, prompt, userId, updatedAt, ...rest }) => rest),
        };
    }
}
