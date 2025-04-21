"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, BookmarkCheck } from "lucide-react"

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  imageUrl?: string
}

interface RecipeResultsProps {
  recipes: Recipe[]
  onBookmark: (recipe: Recipe) => void
  bookmarkedRecipes: Recipe[]
  searchMode?: "title" | "ingredients"
}

export default function RecipeResults({
  recipes,
  onBookmark,
  bookmarkedRecipes,
  searchMode = "title",
}: RecipeResultsProps) {
  const isBookmarked = (recipeId: string) => {
    return bookmarkedRecipes.some((recipe) => recipe.id === recipeId)
  }

  return (
    <div className="space-y-4">
      {recipes.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            {searchMode === "title"
              ? "Enter a recipe name and click Search to find recipes."
              : "Select ingredients and click Search to find recipes that use them."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative">
                <Image
                  src={recipe.imageUrl || "/placeholder.svg"}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={searchMode === "title" ? "default" : "secondary"}>
                    {searchMode === "title" ? "Title Match" : "Ingredient Match"}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{recipe.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onBookmark(recipe)}
                    disabled={isBookmarked(recipe.id)}
                  >
                    {isBookmarked(recipe.id) ? (
                      <BookmarkCheck className="h-5 w-5 text-primary" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium">Ingredients:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recipe.ingredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className={`text-xs px-2 py-1 rounded-full ${
                          searchMode === "ingredients" && recipe.ingredients.includes(ingredient)
                            ? "bg-primary/10 text-primary-foreground border border-primary/30"
                            : "bg-secondary"
                        }`}
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}