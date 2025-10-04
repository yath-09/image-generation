import { prismaClient } from "db";

export class ModelService {
    static async getUserModels(userId: string) {
        const models = await prismaClient.model.findMany({
            where: {
                OR: [{ userId: userId }, { open: true }], // open for globally available 
            },
        });

        return {
            models: models.map(
                (({ falAiRequestId, tensorPath, zipUrl, type, age, eyeColor, bald, userId, ethinicity, updatedAt, triggerWord, ...rest }) => rest)
            ),
        };
    }
}
