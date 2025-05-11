"use client";

import React from "react";
import RecipeCard from "@/components/recipes/RecipeCard";

// For the recipes from the API
interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  imageUrl?: string;
}

// For the savedRecipes in the db
interface SavedRecipe {
  id: string
  userId: string
  recipeName: string
  recipePicture: string
}

interface RecipeResultsProps {
  recipes: Recipe[];
  onBookmark: (recipe: Recipe) => void;
  onRemove: (recipeId: string) => void;
  bookmarkedRecipes: SavedRecipe[] | undefined;
  searchMode?: "title" | "ingredients";
  onRecipeClick?: (recipe: Recipe) => void; // Optional callback for recipe click
}

export default function RecipeResults({
  recipes = [], // Default to an empty array
  onBookmark,
  onRemove,
  bookmarkedRecipes = [], // Default to an empty array
  searchMode = "title",
  onRecipeClick,
}: RecipeResultsProps) {
  const isBookmarked = (recipeId: string) => {
    if (!bookmarkedRecipes) return false
    for (let i = 0; i < bookmarkedRecipes.length; i++) {
      if (bookmarkedRecipes[i].id === recipeId) {
        return true
      }
    }
    return false
  };

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          {searchMode === "title"
            ? "Enter a recipe name and click Search to find recipes."
            : "Select ingredients and click Search to find recipes that use them."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isBookmarked={isBookmarked(recipe.id)}
          onBookmark={onBookmark}
          onRemove={onRemove}
          onClick={onRecipeClick}
        />
      ))}
    </div>
  );
}