import { prismaClient } from "db";

export class UserService {
    static async getUserCredits(userId: string) {
        const userCredit = await prismaClient.userCredit.findUnique({
            where: {
                userId: userId,
            },
            select: {
                amount: true,
            },
        });

        return {
            credits: userCredit?.amount || 0,
        };
    }
}
