-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "ingredientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ingredientName" TEXT NOT NULL,
    "ingredientPicture" TEXT NOT NULL,
    "ingredientDateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ingredientDateExpired" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("ingredientId")
);

-- CreateTable
CREATE TABLE "Food" (
    "foodId" TEXT NOT NULL,
    "foodName" TEXT NOT NULL,
    "foodPicture" TEXT NOT NULL,
    "foodDateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foodDateExpired" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("foodId")
);

-- CreateTable
CREATE TABLE "SavedRecipe" (
    "recipeId" TEXT NOT NULL,
    "recipeName" TEXT NOT NULL,

    CONSTRAINT "SavedRecipe_pkey" PRIMARY KEY ("recipeId")
);

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
