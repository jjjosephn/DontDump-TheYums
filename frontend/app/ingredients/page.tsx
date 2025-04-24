"use client"

import { useState } from "react"
import Image from "next/image"
import { differenceInDays, format } from "date-fns"
import { Plus, AlertTriangle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AddIngredientForm } from "@/components/ingredients/AddIngredientsForm"
import { useAddIngredientMutation, useGetAllIngredientsQuery } from "../state/api"

interface Ingredient {
  ingredientId: string;
  ingredientName: string;
  ingredientPicture: string | null;
  ingredientDateAdded: Date;
  ingredientDateExpired: Date;
}

interface NewIngredient {
  ingredientName: string;
  ingredientPicture: string | null;
  ingredientDateExpired: Date;
}

interface FormattedIngredient {
  name: string;
  image: string | null;
  expiryDate: string;
}

export default function IngredientInventory() {
  const { data: ingredients = [], refetch } = useGetAllIngredientsQuery({})
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [add] = useAddIngredientMutation()

  const filteredIngredients: Ingredient[] = ingredients
    .filter((ingredient: Ingredient) => ingredient.ingredientName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a: Ingredient, b: Ingredient) => {
      const daysUntilExpiryA = differenceInDays(new Date(a.ingredientDateExpired), new Date())
      const daysUntilExpiryB = differenceInDays(new Date(b.ingredientDateExpired), new Date())

      const isExpiringSoonA = daysUntilExpiryA < 5
      const isExpiringSoonB = daysUntilExpiryB < 5

      if (isExpiringSoonA && !isExpiringSoonB) return -1
      if (!isExpiringSoonA && isExpiringSoonB) return 1

      return new Date(a.ingredientDateExpired).getTime() - new Date(b.ingredientDateExpired).getTime()
    })

  const addIngredient = async(newIngredient: NewIngredient) => {
    const formattedIngredient: FormattedIngredient = {
      name: newIngredient.ingredientName,
      image: newIngredient.ingredientPicture,
      expiryDate: newIngredient.ingredientDateExpired.toISOString(),
    };

    try {
      await add(formattedIngredient).unwrap()
      await refetch()
    } catch (error) {
      console.error("Failed to add ingredient:", error)
    }
    setIsDialogOpen(false)
    console.log(newIngredient)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ingredient Inventory</h1>
            <p className="text-muted-foreground">Manage your ingredients and track expiration dates</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Ingredient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Ingredient</DialogTitle>
                <DialogDescription>
                  Fill out the form below to add a new ingredient to your inventory.
                </DialogDescription>
              </DialogHeader>
              <AddIngredientForm onAddIngredient={addIngredient} />
            </DialogContent>
          </Dialog>
        </header>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search ingredients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-muted-foreground">
              {ingredients.filter((i: Ingredient) => differenceInDays(new Date(i.ingredientDateExpired), new Date()) <= 0).length > 0 ? (
                <>
                  <span className="font-medium text-red-600">
                    {ingredients.filter((i: Ingredient) => differenceInDays(new Date(i.ingredientDateExpired), new Date()) <= 0).length}{" "}
                    expired
                  </span>
                  {" & "}
                  {
                    ingredients.filter(
                      (i: Ingredient) =>
                        differenceInDays(new Date(i.ingredientDateExpired), new Date()) > 0 &&
                        differenceInDays(new Date(i.ingredientDateExpired), new Date()) < 5,
                    ).length
                  }{" "}
                  expiring soon
                </>
              ) : (
                <>
                  {ingredients.filter((i: Ingredient) => differenceInDays(new Date(i.ingredientDateExpired), new Date()) < 5).length} items
                  expiring soon
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {(filteredIngredients.some((i: Ingredient) => differenceInDays(new Date(i.ingredientDateExpired), new Date()) < 5) ||
            filteredIngredients.some((i: Ingredient) => differenceInDays(new Date(i.ingredientDateExpired), new Date()) <= 0)) && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="font-medium">
                {filteredIngredients.some((i: Ingredient) => differenceInDays(new Date(i.ingredientDateExpired), new Date()) <= 0)
                  ? "Expired & Expiring Soon"
                  : "Expiring Soon"}
              </h2>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredIngredients.map((ingredient: Ingredient) => {
              const daysUntilExpiry = differenceInDays(new Date(ingredient.ingredientDateExpired), new Date())
              const isExpiringSoon = daysUntilExpiry < 5

              return (
                <Card key={ingredient.ingredientId} className={isExpiringSoon ? "border-amber-300" : ""}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{ingredient.ingredientName}</CardTitle>
                      {daysUntilExpiry <= 0 ? (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Expired
                        </Badge>
                      ) : isExpiringSoon ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {daysUntilExpiry === 1 ? "Expires tomorrow" : `${daysUntilExpiry} days left`}
                        </Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="aspect-square relative overflow-hidden rounded-md mb-3">
                      <Image
                        src={ingredient.ingredientPicture || "/placeholder.svg"}
                        alt={ingredient.ingredientName}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4 pt-0 text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full">
                      <span className="text-muted-foreground">Added:</span>
                      <span>{format(new Date(ingredient.ingredientDateAdded), "MMM d, yyyy")}</span>
                      <span className="text-muted-foreground">Expires:</span>
                      <span
                        className={
                          daysUntilExpiry <= 0
                            ? "font-medium text-red-700"
                            : isExpiringSoon
                              ? "font-medium text-amber-700"
                              : ""
                        }
                      >
                        {format(new Date(ingredient.ingredientDateExpired), "MMM d, yyyy")}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}

            {filteredIngredients.length === 0 && (
              <div className="col-span-full flex justify-center items-center py-12 text-muted-foreground">
                No ingredients found. Add some ingredients to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}