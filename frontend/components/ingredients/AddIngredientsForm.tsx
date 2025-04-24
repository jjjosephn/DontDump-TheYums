"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useFetchIngredientsQuery } from "@/app/state/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddIngredientFormProps {
  onAddIngredient: (ingredient: {
    ingredientName: string
    ingredientPicture: string
    ingredientDateAdded: Date
    ingredientDateExpired: Date
  }) => void
}

interface Ingredient {
  id: number
  name: string
  image?: string
}

export function AddIngredientForm({ onAddIngredient }: AddIngredientFormProps) {
    const [ingredientName, setIngredientName] = useState("")
    const [ingredientPicture, setIngredientPicture] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [expiryDate, setExpiryDate] = useState<Date>(new Date())
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const formatDateForInput = (date: Date) => {
      return date.toISOString().split("T")[0]
    }

    const shouldFetch = searchTerm.length >= 2

    const { data, isLoading, isFetching } = useFetchIngredientsQuery(searchTerm, {
      skip: !shouldFetch,
    })

    const searchResults = data?.results || []
    const isSearching = isLoading || isFetching

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setShowDropdown(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [])

    // Update dropdown visibility when results change
    useEffect(() => {
      setShowDropdown(shouldFetch && searchResults.length > 0)
    }, [searchResults, shouldFetch])

    useEffect(() => {
      const timer = setTimeout(() => {}, 500)
      return () => clearTimeout(timer)
    }, [searchTerm])

    const handleSelectIngredient = (ingredient: any) => {
      setIngredientName(ingredient.name)
      setSearchTerm(ingredient.name)
      if (ingredient.image) {
        setIngredientPicture(`https://img.spoonacular.com/ingredients_250x250/${ingredient.image}`)
      } else {
        setIngredientPicture("/placeholder.svg?height=200&width=200")
      }
      setShowDropdown(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      if (!ingredientName.trim()) {
        return
      }

      setIsSubmitting(true)

      const newIngredient = {
        ingredientName,
        ingredientPicture: ingredientPicture || "/placeholder.svg?height=200&width=200",
        ingredientDateAdded: new Date(),
        ingredientDateExpired: expiryDate,
      }

      onAddIngredient(newIngredient)

      setIngredientName("")
      setIngredientPicture("")
      setSearchTerm("")
      setExpiryDate(new Date())
      setIsSubmitting(false)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-2 relative" ref={dropdownRef}>
          <Label htmlFor="name">Ingredient Name</Label>
          <Input
            id="name"
            placeholder="Search for ingredient"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && searchResults.length > 0 && setShowDropdown(true)}
            required
          />

          {/* Dropdown for search results */}
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-200">
              {isSearching ? (
                <div className="p-2 text-gray-500">Searching...</div>
              ) : searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((ingredient: Ingredient) => (
                    <li
                      key={ingredient.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectIngredient(ingredient)}
                    >
                      {ingredient.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-2 text-gray-500">No ingredients found</div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry">Expiration Date</Label>
          <Input
            id="expiry"
            type="date"
            value={formatDateForInput(expiryDate)}
            onChange={(e) => {
              const newDate = e.target.value ? new Date(e.target.value) : new Date()
              setExpiryDate(newDate)
            }}
            className="w-full"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || !ingredientName}>
          {isSubmitting ? "Adding..." : "Add Ingredient"}
        </Button>
      </form>
    )
}
