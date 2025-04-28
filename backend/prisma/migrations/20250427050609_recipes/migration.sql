/*
  Warnings:

  - You are about to drop the column `recipeName` on the `SavedRecipe` table. All the data in the column will be lost.
  - Added the required column `userId` to the `SavedRecipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedRecipe" DROP COLUMN "recipeName",
ADD COLUMN     "userId" TEXT NOT NULL;
