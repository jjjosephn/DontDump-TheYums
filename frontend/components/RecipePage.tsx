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

import {Label } from "@/components/ui/label" //

// custom ui components
import IngredientFilter from "@/components/IngredientFilter"


// icons
import { Search, Bookmark } from "lucide-react"


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

type SearchMode = "title" | "ingredients"

function handleSearch() {

}

export default function RecipePage() {
    const [activeTab, setActiveTab] = useState("search")
    const [searchMode, setSearchMode] = useState<SearchMode>("title")
    const [query, setQuery] = useState("")
    const [inventory, setInventory] = useState<Ingredient[]>([
        {
        name: "Sugar",
        imageUrl: "/placeholder.svg",
        expirationDate: new Date(2024, 12, 31),
      },
      {
        name: "Butter",
        imageUrl: "/placeholder.svg",
        expirationDate: new Date(2024, 6, 10),
      },
      {
        name: "Chicken",
        imageUrl: "/placeholder.svg",
        expirationDate: new Date(2024, 4, 5),
      },
      {
        name: "Rice",
        imageUrl: "/placeholder.svg",
        expirationDate: new Date(2025, 1, 15),
      },
      {
        name: "Tomatoes",
        imageUrl: "/placeholder.svg",
        expirationDate: new Date(2024, 4, 10),
      },
    ])
    const [selectedIngredients, setselectedIngredients] = useState<string[]>([])

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
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="p1-9"
                                    ></Input>
                                </div>
                                <Button onClick={handleSearch}> Search </Button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <IngredientFilter
                                    inventory={inventory}
                                    selected={selectedIngredients}
                                    onChange={setselectedIngredients}
                                />
                                <Button onClick={handleSearch} disabled={selectedIngredients.length === 0}>
                                    Search
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </TabsContent>
        </Tabs>

    </div>
)
}