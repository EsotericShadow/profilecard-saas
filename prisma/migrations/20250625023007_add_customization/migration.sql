/*
  Warnings:

  - You are about to drop the column `behindGradient` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `cardRadius` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `innerGradient` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `showBehindGradient` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "behindGradient",
DROP COLUMN "cardRadius",
DROP COLUMN "innerGradient",
DROP COLUMN "showBehindGradient",
ADD COLUMN     "customization" JSONB;
