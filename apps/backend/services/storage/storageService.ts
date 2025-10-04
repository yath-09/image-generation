import { S3Client } from "bun";

export class StorageService {
    static async generatePresignedUrl() {
        const key = `models/${Date.now()}_${Math.random()}.zip`;
        const url = S3Client.presign(key, {
            method: "PUT",
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
            endpoint: process.env.S3_ENDPOINT,
            bucket: process.env.S3_BUCKET_NAME,
            expiresIn: 60 * 5,
            type: "application/zip"
        });

        return { url, key };
    }
}
