"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useFetchDisposalTipQuery } from "@/app/state/api"
import { Loader2 } from "lucide-react"

interface Ingredient {
  ingredientId: string
  ingredientName: string
  ingredientPicture: string | null
  ingredientDateAdded: Date
  ingredientDateExpired: Date
}

interface DisposalTipsProps {
  ingredient: Ingredient
}

export default function DisposalTips({ ingredient }: DisposalTipsProps) {
    const { data, isLoading, isError, error } = useFetchDisposalTipQuery(ingredient.ingredientName, {
        // Add this to see the full request details
        refetchOnMountOrArgChange: true
    });
    return (
    <Card className="mt-4">
        <CardContent className="pt-1">
        <h3 className="font-medium mb-2">Disposal Tips</h3>
        {isLoading ? (
            <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        ) : isError ? (
            <div className="text-sm text-destructive">
            Failed to load disposal tips
            </div>
        ) : (
            <div className="text-sm space-y-2">
            <p>{data?.tip || "No disposal tips available"}</p>
            </div>
        )}
        </CardContent>
    </Card>
    )
}