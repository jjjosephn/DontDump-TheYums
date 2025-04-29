"use client"
import Image from "next/image"
import { Bookmark, BookmarkCheck, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  imageUrl?: string
}

interface RecipeCardProps {
  recipe: Recipe
  isBookmarked?: boolean
  onBookmark?: (recipe: Recipe) => void
  onRemove?: (recipeId: string) => void
  onClick?: (recipe: Recipe) => void
  showBookmarkButton?: boolean
  showRemoveButton?: boolean
}

export default function RecipeCard({
  recipe,
  isBookmarked,
  onBookmark,
  onRemove,
  onClick,
  showBookmarkButton = true,
  showRemoveButton = false,
}: RecipeCardProps) {
  console.log(recipe + " is current card")
  console.log(isBookmarked)
  return (
    <div
      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(recipe)}
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
          {showBookmarkButton && onBookmark && (
            <button
              className="text-gray-500 hover:text-primary"
              onClick={(e) => {
                e.stopPropagation()
                onBookmark(recipe)
              }}
            >
              {isBookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
            </button>
          )}
          {showRemoveButton && onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(recipe.id)
              }}
            >
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          )}
        </div>
        <div className="mt-2">
          <p className="text-sm font-medium">Ingredients:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                >
                  {ingredient}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No ingredients listed</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}