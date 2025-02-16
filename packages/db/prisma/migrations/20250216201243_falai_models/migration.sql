-- CreateEnum
CREATE TYPE "ModelTrainingStatus" AS ENUM ('PENDING', 'GENERATED', 'FAILED');

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "falAiRequestId" TEXT,
ADD COLUMN     "trainingStatus" "ModelTrainingStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "falAiRequestId" TEXT;
