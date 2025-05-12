"use client"

// tab for bookmarked and search

// bookmarked: show recipe (title, image, description) each recipe has a bookmark icon (button)
// probably needs recipe card component

// search: input, button (submit)
// filter component: (dialog box -> scrollarea -> multiselect)
// create separate filter component file
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"

// ui components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label" //

// custom ui components
import IngredientFilter from "@/components/recipes/IngredientFilter"
import RecipeResults from "@/components/recipes/RecipeResults"
import BookmarkedRecipes from "@/components/recipes/BookmarkedRecipes"
import { RecipeDetail } from "@/components/recipes/RecipeDetail"

// icons
import { Search, Bookmark } from "lucide-react"
import { ChefHat } from "lucide-react"

// hooks for calling api
import { useComplexRecipeSearchQuery } from "../../app/state/api"
import { useIngredientRecipeSearchQuery } from "../../app/state/api"
import { useGetIngredientsFilterQuery } from "../../app/state/api"

import { useGetRecipeDetailQuery } from "../../app/state/api" // this is called in the RecipeDetail component

import { useBookmarkRecipeMutation } from "../../app/state/api"
import { useUnbookmarkRecipeMutation } from "../../app/state/api"
import { useGetAllRecipesQuery } from "../../app/state/api"
import { set } from "date-fns"

// typing (review later)

interface Recipe {
    id: string
    title: string
    ingredients: string[]
    imageUrl?: string
}

type SearchMode = "title" | "ingredients"

export default function RecipePage() {
    const { user } = useUser()
    const [activeTab, setActiveTab] = useState("search")
    const [searchMode, setSearchMode] = useState<SearchMode>("title")
    const [searchTerms, setSearchTerms] = useState("") // for search by title
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<Recipe[]>([])
    const [inventory, setInventory] = useState<Ingredient[]>([])
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
    const {
        data: ingredientRecipeData,
        error: ingredientRecipeError,
        isLoading: ingredientRecipeLoading,
      } = useIngredientRecipeSearchQuery({
        ingredients: selectedIngredients,
        number: 10,
    });

    const {
        data: complexRecipeData,
        error: complexRecipeError,
        isLoading: complexLoading,
        } = useComplexRecipeSearchQuery({
        terms: searchTerms,
        number: 10,
    });

    const {
        data: ingredientData,
        error: ingredientError,
        isLoading: ingredientLoading,
        isFetching: ingredientFetching,
        refetch,
    } = useGetIngredientsFilterQuery({
        filter: { userId: user?.id },
    });

    const [bookmarkRecipe] = useBookmarkRecipeMutation();
    const [unbookmarkRecipe] = useUnbookmarkRecipeMutation();
    const { data: bookmarkedRecipes, isLoading, error, refetch:refetchBookmarks } = useGetAllRecipesQuery(user?.id); // this is meant to be saved recipes
    const handleSearch = async () => {
        if (selectedIngredients.length === 0) {
            // need an error message/ui component "please select ingredients to search"
            setLoading(false);
            return;
        }
        try {
            if (ingredientRecipeData) {
                const transformedRecipes = ingredientRecipeData.map(recipe => ({
                    id: recipe.id.toString(),
                    title: recipe.title,
                    imageUrl: recipe.image,
                    ingredients: [
                        ...recipe.usedIngredients.map(ing => ing.name),
                        ...recipe.missedIngredients.map(ing => ing.name)
                    ],
                    usedIngredientCount: recipe.usedIngredientCount,
                    missedIngredientCount: recipe.missedIngredientCount,

                    apiData: recipe
                }));
                
                setResults(transformedRecipes);
            } else {
                setResults([]);
                console.error("Error fetching recipes: No data returned");
            }
        } catch (error) {
            setResults([]);
            console.error("Error fetching recipes:", error);
        }
    };

    const handleComplexSearch = async () => {
        setLoading(true);
        console.log("complex search called")
        try {
            if (complexRecipeData && Array.isArray(complexRecipeData.results)) {
                const transformedRecipes = complexRecipeData.results.map(recipe => ({
                    id: recipe.id.toString(),
                    title: recipe.title,
                    imageUrl: recipe.image,
                    ingredients: [], // No ingredients in this response
                    usedIngredientCount: 0, // Not applicable for complex search
                    missedIngredientCount: 0, // Not applicable for complex search
                    apiData: recipe // Store raw recipe data for debugging or future use
                }));
                
                setResults(transformedRecipes);
            } else {
                setResults([]);
                console.error("Error fetching recipes: No data returned");
            }
        } catch (error) {
            setResults([]);
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleBookmarkRecipe = async (recipe: Recipe) => {
        // recipeController req.body for LHS and RHS is just the recipe data/userid
        try {
          await bookmarkRecipe({
            userId: user?.id,
            id: recipe.id,
            name: recipe.title,
            image: recipe.imageUrl,
          }).unwrap();
          refetchBookmarks();
        } catch (err) {
          console.error('Bookmark failed:', err);
        }
    }
    
    const handleRemoveBookmark = async (recipeId: string) => {
        console.log("handleRemoveBookmark called")
        try {
            console.log("handle remove bookmark", recipeId);
            await unbookmarkRecipe({
                userId: user?.id,
                recipeId: recipeId
            }).unwrap();
            await refetchBookmarks()
        } catch (err) {
            console.error('Unbookmark failed:', err);
        }
    }

    const handleRecipeClick = async (recipe: Recipe) => {
        setSelectedRecipeId(recipe.id); // Set the selected recipe ID needed for the recipeDetails
        console.log("recipe clicked", recipe.id)
    };

return (
    <div className="space-y-4">
        <Tabs 
        defaultValue="search" 
        value={activeTab} 
        onValueChange={(value) => {
            setActiveTab(value);
            if (value === "bookmarks") {
                refetchBookmarks();
            }
        }
        }>
            <TabsList className="grid w-full grid-cols-2 bg-[var(--tablist-bg)]">
                <TabsTrigger value="search" className="tab-trigger flex items-center gap-2">
                    <Search className="h-4 w-4">
                        Search Recipes
                    </Search>
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="tab-trigger flex items-center gap-2">
                    <Bookmark className="h-4 w-4">
                        Bookmarked Recipes
                    </Bookmark>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="search" className="space-y-4">
                {}
                <div className="bg-muted/30 p-4 rounded-lg">
                    <RadioGroup
                        value={searchMode}
                        onValueChange={(value) => 
                            setSearchMode(value as SearchMode)
                        }
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="title" id="search-title"/>
                            <Label htmlFor="search-title"
                            className="font-medium">
                                Search by Recipe Title
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ingredients" id="search-ingredients"/>
                            <Label htmlFor="search-ingredients"
                            className="font-medium">
                                Search by Ingredients
                            </Label>
                        </div>
                    </RadioGroup>
                    <div className="mt-4">
                        {searchMode === "title" ? (
                            <div className="flex space-x-2">
                                <div className="relative flex-grow">
                                    <Search className="absolute right-3 top-1/2
                                    transform -translate-y-1/2 h-4 w-4
                                    text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Enter recipe name"
                                        value={ searchTerms }
                                        onChange={(e) => setSearchTerms(e.target.value)}
                                        className="p1-9"
                                    ></Input>
                                </div>
                                <Button onClick={ handleComplexSearch } disabled={ loading }> 
                                    {loading ? "Searching..." : "Search" } 
                                </Button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <IngredientFilter
                                    inventory={ ingredientData }
                                    selected={ selectedIngredients }
                                    onChange={ setSelectedIngredients }
                                    onFetchIngredients={ refetch }
                                />
                                <Button onClick={ handleSearch } disabled={ loading || selectedIngredients.length === 0 }>
                                    { loading ? "Searching..." : "Search" }
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        {searchMode === "title" ? (
                        <div className="flex items-center gap-2 mb-2">
                            <ChefHat className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-medium">Recipes matching "{ searchTerms }"</h2>
                        </div>
                        ) : (
                        <div className="flex items-center gap-2 mb-2">
                            <ChefHat className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-medium">
                            Recipes with{" "}
                            {selectedIngredients.length > 0 ? (
                                <>
                                {selectedIngredients.map((ing, i) => (
                                    <span key={ing}>
                                    {i > 0 && i === selectedIngredients.length - 1 ? " and " : i > 0 ? ", " : ""}
                                    <span className="font-semibold">{ing}</span>
                                    </span>
                                ))}
                                </>
                            ) : (
                                "selected ingredients"
                            )}
                            </h2>
                        </div>
                        )}
                        <RecipeResults
                        recipes={ results }
                        onBookmark={ handleBookmarkRecipe }
                        onRemove={ handleRemoveBookmark }
                        bookmarkedRecipes={ bookmarkedRecipes }
                        onRecipeClick={ handleRecipeClick }
                        searchMode={ searchMode } // show diff text depending on search mod
                        />
                        <RecipeDetail 
                        recipeId={ selectedRecipeId }
                        open={ !!selectedRecipeId }
                        onOpenChange={ (open) => {
                            if (!open) setSelectedRecipeId(null)
                        } }
                        />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="bookmarks">
                <BookmarkedRecipes 
                recipes={bookmarkedRecipes} 
                onRemoveBookmark={handleRemoveBookmark} 
                onRecipeClick={handleRecipeClick}
                />
                <RecipeDetail 
                recipeId={ selectedRecipeId }
                open={ !!selectedRecipeId }
                onOpenChange={ (open) => {
                if (!open) setSelectedRecipeId(null)
                } }
                />
            </TabsContent>
        </Tabs>
    </div>
)
}