import { TrainModel } from "common/types";
import { z } from "zod";
import { prismaClient } from "db";
import { FalAiModel } from "../../models/FalAiModel";

const falAiModel = new FalAiModel();

export class TrainingService {
    static async trainModel(data: z.infer<typeof TrainModel>, userId: string) {
        const { request_id, response_url } = await falAiModel.trainModel(data.zipUrl, data.name);

        const modelData = await prismaClient.model.create({
            data: {
                name: data.name,
                type: data.type,
                age: data.age,
                ethinicity: data.ethinicity,
                eyeColor: data.eyeColor,
                bald: data.bald,
                userId: userId,
                zipUrl: data.zipUrl,
                falAiRequestId: request_id, //currently been set to "" to prevent the fal ai pricing 
            }
        });

        return { modelId: modelData.id };
    }
}
