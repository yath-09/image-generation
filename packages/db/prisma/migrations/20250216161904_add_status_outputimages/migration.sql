/*
  Warnings:

  - Added the required column `prompt` to the `OutputImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `OutputImages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OutputImageStatus" AS ENUM ('PENDING', 'GENERATED', 'FAILED');

-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "status" "OutputImageStatus" NOT NULL;
