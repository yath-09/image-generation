/*
  Warnings:

  - Made the column `falAiRequestId` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `falAiRequestId` on table `OutputImages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Model" ALTER COLUMN "falAiRequestId" SET NOT NULL,
ALTER COLUMN "falAiRequestId" SET DEFAULT '';

-- AlterTable
ALTER TABLE "OutputImages" ALTER COLUMN "falAiRequestId" SET NOT NULL,
ALTER COLUMN "falAiRequestId" SET DEFAULT '';
