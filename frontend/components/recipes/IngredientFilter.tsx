"use client"

import { useState } from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
// need a dialog box for the filter box
// need a scrol area for the dialog box
// need a button to close out the box
// need the filter icon?

import { Filter } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"

interface Ingredient {
    ingredientId: string
    userId: string
    ingredientName: string
    ingredientPicture: string
    ingredientDateExpired: Date
}

interface IngredientFilterProps {
    inventory: Ingredient[]
    selected: string[] | undefined
    onChange: (selected: string[]) => void
    onFetchIngredients: () => void
}

export default function IngredientFilter({
    inventory = [], 
    selected = [], 
    onChange,
    onFetchIngredients
   }: IngredientFilterProps) {
        const [isOpen, setIsOpen] = useState(false)

        useEffect(() => {
          if (isOpen) {
            onFetchIngredients()
            console.log("Inventory passed to IngredientFilter:", inventory)
          }
        }, [isOpen, onFetchIngredients])

        const handleToggle = (ingredientName: string) => {
            const updatedSelected = selected.includes(ingredientName)
            ? selected.filter((item) => item !== ingredientName)
            : [...selected, ingredientName]
            onChange(updatedSelected)
        }

        const handleOpen = () => {
          setIsOpen(true)
          onFetchIngredients()
        }

        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"
                  className="w-[150px] justify-start bg-[var(--filter-button-bg)]"
                  onClick={ handleOpen }>
                  <Filter className="mr-2 h-4 w-4" />
                  {selected.length > 0 ? `${selected.length} selected` : "Filter"}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[80vw] max-w-[800px] bg-[var(--filter-dialog-bg)]">
                <DialogHeader>
                  <DialogTitle>Select Ingredients from Your Inventory</DialogTitle>
                </DialogHeader>
                {inventory.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No ingredients in your inventory. Add ingredients on the ingredients page first!
                  </p>
                ) : (
                  <ScrollArea className="h-[60vh] p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {inventory.map((ingredient) => (
                        <div
                          key={ingredient.ingredientId}
                          className={`p-2 rounded-md cursor-pointer border transition-all ${
                            selected.includes(ingredient.ingredientName)
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-secondary hover:border-primary/50"
                          }`}
                          onClick={() => handleToggle(ingredient.ingredientName)}
                        >
                          <div className="aspect-square relative mb-2">
                            <Image
                              src={ingredient.ingredientPicture || "/FoodImageNotFound.png"}
                              alt={ingredient.ingredientName}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="rounded-md object-cover"
                            />
                          </div>
                          <h3 className="font-semibold">{ingredient.ingredientName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Expires: {format(ingredient.ingredientDateExpired, "MM/dd/yyyy")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </DialogContent>
            </Dialog>
          )
        }