"use client"

import { useGetRecipeDetailQuery } from "../app/state/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface RecipeDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipeId: number | null
}

export function RecipeDetail({ open, onOpenChange, recipeId }: RecipeDetailProps) {
  // Only fetch if we have a recipeId and the dialog is open
  const {
    data: recipe,
    isLoading,
    error,
  } = useGetRecipeDetailQuery(recipeId ?? 0, {
    skip: !recipeId || !open,
    refetchOnMountOrArgChange: true,
  })

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold pr-8">
            {isLoading ? "Loading..." : error ? "Error" : recipe?.title || "Recipe Details"}
          </DialogTitle>
          {/* We're using the built-in DialogClose component instead of a custom button */}
        </DialogHeader>

        {isLoading && <div className="p-4 text-center">Loading recipe details...</div>}

        {error && (
          <div className="p-4 text-red-500 text-center">Failed to load recipe details. Please try again later.</div>
        )}

        {recipe && (
          <div className="space-y-6">
            {/* Recipe Image */}
            <div className="aspect-video relative rounded-md overflow-hidden">
              {recipe.image ? (
                <Image
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
            </div>

            {/* Recipe Summary */}
            {recipe.summary && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
              </div>
            )}

            {/* Recipe Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-semibold">Servings</p>
                <p>{recipe.servings || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Ready in</p>
                <p>{recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Prep time</p>
                <p>{recipe.preparationMinutes ? `${recipe.preparationMinutes} min` : "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Cook time</p>
                <p>{recipe.cookingMinutes ? `${recipe.cookingMinutes} min` : "N/A"}</p>
              </div>
            </div>

            {/* Source */}
            {recipe.sourceName && (
              <div className="text-sm">
                <span className="font-semibold">Source: </span>
                {recipe.sourceUrl ? (
                  <a
                    href={recipe.sourceUrl}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {recipe.sourceName}
                  </a>
                ) : (
                  <span>{recipe.sourceName}</span>
                )}
              </div>
            )}

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recipe.extendedIngredients.map((ing) => (
                    <li key={ing.id} className="flex items-center gap-3">
                      {ing.image && (
                        <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-muted">
                          <img
                            src={`https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`}
                            alt={ing.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.currentTarget.src = "/placeholder.svg?height=40&width=40"
                            }}
                          />
                        </div>
                      )}
                      <span className="text-slate-800">{ing.original || ing.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic">No ingredients available.</p>
              )}
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
                <ol className="space-y-4">
                  {recipe.analyzedInstructions[0].steps.map((step) => (
                    <li key={step.number} className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                        {step.number}
                      </div>
                      <p className="text-slate-700">{step.step}</p>
                    </li>
                  ))}
                </ol>
              ) : recipe.instructions && recipe.instructions.trim() ? (
                <div className="text-slate-700 whitespace-pre-line">{recipe.instructions}</div>
              ) : (
                <p className="text-muted-foreground italic">No instructions available.</p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}