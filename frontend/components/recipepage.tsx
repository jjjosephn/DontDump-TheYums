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
export default function RecipePage() {
    const [activeTab, setActiveTab] = useState("search")

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
        </Tabs>

        <TabsContent value="search" className="space-y-4">
            
        </TabsContent>

    </div>
)
}
