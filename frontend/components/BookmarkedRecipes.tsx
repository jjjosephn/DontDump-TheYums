"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  imageUrl?: string
}

interface BookmarkedRecipesProps {
  recipes: Recipe[]
  onRemoveBookmark: (recipeId: string) => void
}

export default function BookmarkedRecipes({ recipes, onRemoveBookmark }: BookmarkedRecipesProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No bookmarked recipes yet</h3>
        <p className="text-muted-foreground">Search for recipes and bookmark them to see them here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Bookmarked Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border rounded-lg overflow-hidden">
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
                <Button variant="ghost" size="icon" onClick={() => onRemoveBookmark(recipe.id)}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">Ingredients:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {recipe.ingredients.map((ingredient) => (
                    <span key={ingredient} className="text-xs px-2 py-1 bg-secondary rounded-full">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}