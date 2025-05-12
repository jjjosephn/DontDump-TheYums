"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import { differenceInDays, format } from "date-fns"
import { Plus, AlertTriangle, Search, Trash2, Edit, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AddIngredientForm } from "@/components/ingredients/AddIngredientsForm"
import { useAddIngredientMutation, useGetAllIngredientsQuery, useDeleteIngredientMutation } from "../state/api"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@clerk/nextjs"
import DisposalTips from "@/components/ingredients/DisposalTips"

interface Ingredient {
  ingredientId: string;
  ingredientName: string;
  ingredientPicture: string | null;
  ingredientDateAdded: Date;
  ingredientDateExpired: Date;
}

interface NewIngredient {
  userId: string;
  ingredientName: string;
  ingredientPicture: string | null;
  ingredientDateExpired: Date;
}

export default function IngredientInventory() {
  const { user } = useUser()
  const { data: ingredients = [], isLoading, refetch } = useGetAllIngredientsQuery(user?.id || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOption, setFilterOption] = useState<"all" | "expiring" | "expired">("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [add] = useAddIngredientMutation()
  const [deleteIngredient] = useDeleteIngredientMutation()
  const [disposalDialogOpen, setDisposalDialogOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)

  const filteredIngredients = useMemo(() => {
    return ingredients
      .filter((ingredient: Ingredient) => {
        const matchesSearch = ingredient.ingredientName.toLowerCase().includes(searchQuery.toLowerCase())
        const daysUntilExpiry = differenceInDays(new Date(ingredient.ingredientDateExpired), new Date())
        
        if (filterOption === "expiring") return matchesSearch && daysUntilExpiry > 0 && daysUntilExpiry < 5
        if (filterOption === "expired") return matchesSearch && daysUntilExpiry <= 0
        return matchesSearch
      })
      .sort((a: Ingredient, b: Ingredient) => {
        const daysA = differenceInDays(new Date(a.ingredientDateExpired), new Date())
        const daysB = differenceInDays(new Date(b.ingredientDateExpired), new Date())
        
        // Sort priority: Expired -> Expiring Soon -> Normal
        if (daysA <= 0 && daysB > 0) return -1
        if (daysA > 0 && daysB <= 0) return 1
        if (daysA < 5 && daysB >= 5) return -1
        if (daysA >= 5 && daysB < 5) return 1

        return new Date(a.ingredientDateExpired).getTime() - new Date(b.ingredientDateExpired).getTime()
      })
  }, [ingredients, searchQuery, filterOption])

  const stats = useMemo(() => {
    const expired = ingredients.filter((i: Ingredient) => differenceInDays(new Date(i.ingredientDateExpired), new Date()) <= 0).length
    const expiringSoon = ingredients.filter((i:Ingredient) => {
      const days = differenceInDays(new Date(i.ingredientDateExpired), new Date())
      return days > 0 && days < 5
    }).length
    
    return { expired, expiringSoon }
  }, [ingredients])

  const handleAddIngredient = useCallback(async (newIngredient: NewIngredient) => {
    try {
      await add({
        userId: newIngredient.userId,
        name: newIngredient.ingredientName,
        image: newIngredient.ingredientPicture,
        expiryDate: newIngredient.ingredientDateExpired.toISOString(),
      }).unwrap()
      await refetch()
    } catch (error) {
      console.error("Failed to add ingredient:", error)
    }
  }, [add, refetch])

  const handleRemoveIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setDisposalDialogOpen(true)
  }
  
  const confirmRemove = useCallback(async (id: string) => {
    try {
      console.log(id)
      await deleteIngredient(id)
      await refetch()
    } catch (error) {
      console.error("Failed to delete ingredient:", error)
    }
    setDisposalDialogOpen(false)
  }, [deleteIngredient, refetch])

  const renderExpiryBadge = (days: number) => {
    if (days <= 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      )
    } 
    if (days < 5) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {days === 1 ? "Expires tomorrow" : `${days} days left`}
        </Badge>
      )
    }
    return null
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col space-y-6">
          {/* Header section */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ingredient Inventory</h1>
              <p className="text-muted-foreground mt-1">Manage your ingredients and track expiration dates</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-10">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Ingredient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Ingredient</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to add a new ingredient to your inventory.
                  </DialogDescription>
                </DialogHeader>
                <AddIngredientForm onAddIngredient={handleAddIngredient} />
              </DialogContent>
            </Dialog>
          </header>

          {/* Search and filter section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ingredients..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {filterOption === "all" ? "All" : filterOption === "expiring" ? "Expiring Soon" : "Expired"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterOption("all")}>All Ingredients</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterOption("expiring")}>Expiring Soon</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterOption("expired")}>Expired</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex items-center gap-2 text-sm px-3 py-1 bg-slate-100 rounded-md">
                {stats.expired > 0 && (
                  <div className="flex items-center">
                    <span className="font-medium text-red-600 mr-1">{stats.expired}</span>
                    <span className="text-muted-foreground">expired</span>
                    {stats.expiringSoon > 0 && <span className="mx-1">&bull;</span>}
                  </div>
                )}
                {stats.expiringSoon > 0 && (
                  <div className="flex items-center">
                    <span className="font-medium text-amber-600 mr-1">{stats.expiringSoon}</span>
                    <span className="text-muted-foreground">expiring soon</span>
                  </div>
                )}
                {stats.expired === 0 && stats.expiringSoon === 0 && (
                  <span className="text-muted-foreground">All ingredients fresh</span>
                )}
              </div>
            </div>
          </div>

          {/* Content grid section */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-3 pb-1">
                    <Skeleton className="h-5 w-3/4" />
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <Skeleton className="h-32 w-full mb-2" />
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-3 pt-0">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredIngredients.map((ingredient: Ingredient) => {
                  const daysUntilExpiry = differenceInDays(new Date(ingredient.ingredientDateExpired), new Date())
                  const isExpired = daysUntilExpiry <= 0
                  const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry < 5
                  
                  return (
                    <Card 
                      key={ingredient.ingredientId} 
                      className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                        isExpired ? "border-red-300" : isExpiringSoon ? "border-amber-300" : ""
                      }`}
                    >
                      <CardHeader className="p-3 flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base truncate" title={ingredient.ingredientName}>
                            {ingredient.ingredientName}
                          </CardTitle>
                        </div>
                        <div>{renderExpiryBadge(daysUntilExpiry)}</div>
                      </CardHeader>
                      
                      <CardContent className="p-3 pt-0 pb-2 relative">
                        <div className="aspect-square relative overflow-hidden rounded-md bg-slate-100">
                          <Image
                            src={ingredient.ingredientPicture || "/FoodImageNotFound.png"}
                            alt={ingredient.ingredientName}
                            fill
                            sizes="(max-width: 768px) 100vw, 200px"
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                          
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-full bg-white/80 hover:bg-white shadow-sm"
                                  onClick={() => handleRemoveIngredient(ingredient)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </div>

                          <Dialog open={disposalDialogOpen} onOpenChange={setDisposalDialogOpen}>
                            <DialogContent className="sm:max-w-md bg-[var(--tips-dialog-bg)]">
                              <DialogHeader>
                                <DialogTitle>Remove {selectedIngredient?.ingredientName}</DialogTitle>
                                <DialogDescription>
                                  Removing this ingredient will delete it from your inventory. Are you sure you want to proceed?
                                </DialogDescription>
                              </DialogHeader>

                              {selectedIngredient && <DisposalTips ingredient={selectedIngredient} />}

                              <div className="flex justify-end gap-2 mt-4">
                                <Button className="bg-[var(--tips-dialog-button-bg)]" variant="outline" onClick={() => setDisposalDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={() => confirmRemove(selectedIngredient?.ingredientId ?? "")}>Remove Ingredient</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                      
                      
                      <CardFooter className="flex flex-col items-start p-3 pt-0 text-xs">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-full">
                          <span className="text-muted-foreground">Added:</span>
                          <span>{format(new Date(ingredient.ingredientDateAdded), "MMM d, yyyy")}</span>
                          <span className="text-muted-foreground">Expires:</span>
                          <span
                            className={
                              isExpired
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
                  <div className="col-span-full flex flex-col justify-center items-center py-10 text-muted-foreground">
                    <div className="mb-3 p-3 rounded-full bg-slate-100">
                      <Search className="h-5 w-5" />
                    </div>
                    <p className="font-medium">No ingredients found</p>
                    <p className="text-sm mt-1">
                      {searchQuery || filterOption !== "all" 
                        ? "Try adjusting your search or filters" 
                        : "Add some ingredients to get started"
                      }
                    </p>
                    {(searchQuery || filterOption !== "all") && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => {
                          setSearchQuery("")
                          setFilterOption("all")
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}