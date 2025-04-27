"use client"

// tab for bookmarked and search

// bookmarked: show recipe (title, image, description) each recipe has a bookmark icon (button)
// probably needs recipe card component

// search: input, button (submit)
// filter component: (dialog box -> scrollarea -> multiselect)
// create separate filter component file
import { useState, useEffect } from "react"

// ui components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Label } from "@/components/ui/label" //

// custom ui components
import IngredientFilter from "@/components/IngredientFilter"
import RecipeResults from "@/components/RecipeResults"
import BookmarkedRecipes from "./BookmarkedRecipes"

// icons
import { Search, Bookmark } from "lucide-react"
import { ChefHat } from "lucide-react"

// hooks for calling api
import { useComplexRecipeSearchQuery } from "../app/state/api"
import { useIngredientRecipeSearchQuery } from "../app/state/api"

// typing (review later)
interface Ingredient {
    name: string
    imageUrl: string
    expirationDate: Date
}

interface Recipe {
    id: string
    title: string
    ingredients: string[]
    imageUrl?: string
}

interface Recipe {
    id: string
    title: string
    ingredients: string[]
    imageUrl?: string
}

type SearchMode = "title" | "ingredients"

export default function RecipePage() {
    const [activeTab, setActiveTab] = useState("search")
    const [searchMode, setSearchMode] = useState<SearchMode>("title")
    const [searchTerms, setSearchTerms] = useState("") // for search by title

    const [loading, setLoading] = useState(false)

    // results, handleBookmarkRecipe bookmarkedRecipes
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState<Recipe[]>([])
    const [results, setResults] = useState<Recipe[]>([])
    
    const [inventory, setInventory] = useState<Ingredient[]>([
        {
        name: "Sugar",
        imageUrl: "/placeholder.svg",
        expirationDate: new Date(2024, 12, 31),
      },
      {
        name: "Chicken",
        imageUrl: "/placeholder.svg",
        expirationDate: new Date(2024, 4, 5),
      },
    ])
    const [selectedIngredients, setselectedIngredients] = useState<string[]>([])
    const {
        data: ingredientData,
        error: ingredientError,
        isLoading: ingredientLoading,
      } = useIngredientRecipeSearchQuery({
        ingredients: selectedIngredients,
        number: 10,
      });
      const {
        data: complexData,
        error: complexError,
        isLoading: complexLoading,
      } = useComplexRecipeSearchQuery({
        terms: searchTerms,
        number: 10,
      });

    const handleSearch = async () => {
        console.log()
        if (selectedIngredients.length === 0) {
            // need an error message/ui component "please select ingredients to search"
            setLoading(false);
            return;
        }
        try {
            if (ingredientData) {
                const transformedRecipes = ingredientData.map(recipe => ({
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
            if (complexData && Array.isArray(complexData.results)) {
                const transformedRecipes = complexData.results.map(recipe => ({
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

    const handleBookmarkRecipe = (recipe: Recipe) => {
        if (!bookmarkedRecipes.some((r) => r.id === recipe.id)) {
          const updatedBookmarks = [...bookmarkedRecipes, recipe]
          setBookmarkedRecipes(updatedBookmarks)
        }
    }
    
    const handleRemoveBookmark = (recipeId: string) => {
        const updatedBookmarks = bookmarkedRecipes.filter((recipe) => recipe.id !== recipeId)
        setBookmarkedRecipes(updatedBookmarks)
    }

    const handleRecipeClick = (recipe) => {
        console.log("Recipe clicked:", recipe);
        // Navigate to a detailed view or perform another action
      };

return (
    <div className="space-y-4">
        <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search" className="flex items-center gap-2">
                    <Search className="h-4 w-4">
                        Search Recipes
                    </Search>
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="flex items-center gap-2">
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
                                    inventory={inventory}
                                    selected={selectedIngredients}
                                    onChange={setselectedIngredients}
                                />
                                <Button onClick={ handleSearch } disabled={loading || selectedIngredients.length === 0}>
                                    {loading ? "Searching..." : "Search"}
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
                        bookmarkedRecipes={ bookmarkedRecipes }
                        onRecipeClick={ handleRecipeClick }
                        searchMode={ searchMode } // show diff text depending on search mod
                        /> 
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="bookmarks">
                <BookmarkedRecipes recipes={bookmarkedRecipes} onRemoveBookmark={handleRemoveBookmark} />
            </TabsContent>
        </Tabs>
    </div>
)
}