/*
  Warnings:

  - The primary key for the `SavedRecipe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `savedRecipeId` on the `SavedRecipe` table. All the data in the column will be lost.
  - Added the required column `recipeId` to the `SavedRecipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedRecipe" DROP CONSTRAINT "SavedRecipe_pkey",
DROP COLUMN "savedRecipeId",
ADD COLUMN     "recipeId" TEXT NOT NULL,
ADD CONSTRAINT "SavedRecipe_pkey" PRIMARY KEY ("userId", "recipeId");
