"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
// need a dialog box for the filter box
// need a scrol area for the dialog box
// need a button to close out the box
// need the filter icon?


interface Ingredient {
    name: string
    imageUrl: string
    expirationDate: Date
}

interface IngredientFilterProps {
    inventory: Ingredient[]
    selected: string[] | undefined
    onChange: (selected: string[]) => void
}

export default function Ingredientfilter(
    { inventory, selected = [], onChange }: IngredientFilterProps) {
        const[isOpen, setIsOpen] = useState(false)
        const handleToggle = (ingredientName: string) => {
            const updatedSelected = selected.includes(ingredientName)
            ? selected.filter((item) => item !== ingredientName)
            : [...selected, ingredientName]
            onChange(updatedSelected)
        }

        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    
                </DialogTrigger>

            </Dialog>
        )

}