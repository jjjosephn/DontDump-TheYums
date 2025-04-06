"use client"

// tab for bookmarked and search

// bookmarked: show recipe (title, image, description) each recipe has a bookmark icon (button)
// probably needs recipe card component

// search: input, button (submit)
// filter component: (dialog box -> scrollarea -> multiselect)
// create separate filter component file
import { useState, useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {Label } from "@/components/ui/label" //

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


export default function RecipePage() {
    const [activeTab, setActiveTab] = useState("search")
    const [searchMode, setSearchMode] = useState<SearchMode>("title")

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

                </div>
            </TabsContent>
        </Tabs>

    </div>
)
}
