import React from "react";
import Image from "next/image";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  imageUrl?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  isBookmarked: boolean;
  onBookmark: (recipe: Recipe) => void;
  onClick?: (recipe: Recipe) => void; // Optional click handler for the card
}

export default function RecipeCard({
  recipe,
  isBookmarked,
  onBookmark,
  onClick,
}: RecipeCardProps) {
  return (
    <div
      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(recipe)} // Trigger the onClick handler if provided
    >
      <div className="aspect-video relative">
        <Image
          src={recipe.imageUrl || "/placeholder.svg"}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{recipe.title}</h3>
          <button
            className="text-gray-500 hover:text-primary"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card's onClick
              onBookmark(recipe);
            }}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="mt-2">
          <p className="text-sm font-medium">Ingredients:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {recipe.ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}