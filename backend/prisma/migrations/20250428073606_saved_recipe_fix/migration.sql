/*
  Warnings:

  - The primary key for the `SavedRecipe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `recipeId` on the `SavedRecipe` table. All the data in the column will be lost.
  - The required column `saviedRecipeId` was added to the `SavedRecipe` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "SavedRecipe" DROP CONSTRAINT "SavedRecipe_pkey",
DROP COLUMN "recipeId",
ADD COLUMN     "saviedRecipeId" TEXT NOT NULL,
ADD CONSTRAINT "SavedRecipe_pkey" PRIMARY KEY ("saviedRecipeId");
