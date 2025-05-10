/*
  Warnings:

  - Added the required column `recipeName` to the `SavedRecipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipePicture` to the `SavedRecipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedRecipe" ADD COLUMN     "recipeName" TEXT NOT NULL,
ADD COLUMN     "recipePicture" TEXT NOT NULL;
