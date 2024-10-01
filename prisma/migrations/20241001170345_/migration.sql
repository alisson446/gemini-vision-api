/*
  Warnings:

  - Added the required column `imageUrl` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Measure" ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT NOT NULL;
