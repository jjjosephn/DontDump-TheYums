"use client"
import RecipeCard from "@/components/RecipeCard"

// This matches your actual database schema
interface SavedRecipe {
  savedRecipeId: string
  userId: string
  recipeName: string
  recipePicture: string
}

interface BookmarkedRecipesProps {
  recipes: SavedRecipe[] | undefined
  isLoading?: boolean
  error?: any
  onRemoveBookmark: (recipeId: string) => void
  onRecipeClick?: (recipe: any) => void
}

export default function BookmarkedRecipes({
  recipes,
  isLoading = false,
  error,
  onRemoveBookmark,
  onRecipeClick,
}: BookmarkedRecipesProps) {
  // Convert SavedRecipe to the format expected by RecipeCard
  const mapToRecipeFormat = (savedRecipe: SavedRecipe) => {
    return {
      id: savedRecipe.savedRecipeId,
      title: savedRecipe.recipeName,
      imageUrl: savedRecipe.recipePicture,
      ingredients: [], // Your schema doesn't have ingredients, so use empty array
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Loading your bookmarked recipes...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2 text-destructive">Error loading bookmarks</h3>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    )
  }

  if (!recipes || recipes.length === 0) {
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
        {recipes.map((savedRecipe) => {
          const recipe = mapToRecipeFormat(savedRecipe)
          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              showBookmarkButton={false}
              showRemoveButton={true}
              onRemove={onRemoveBookmark}
              onClick={onRecipeClick ? () => onRecipeClick(recipe) : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
