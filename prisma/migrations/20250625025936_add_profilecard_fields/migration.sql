/*
  Warnings:

  - You are about to drop the column `customization` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "customization",
ADD COLUMN     "behindGradient" TEXT,
ADD COLUMN     "cardRadius" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "innerGradient" TEXT,
ADD COLUMN     "showBehindGradient" BOOLEAN NOT NULL DEFAULT true;
