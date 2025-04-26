"use client"

import Image from "next/image"
import { ArrowRight, ShoppingBasket, UtensilsCrossed, HeartHandshake } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignUpButton, useUser } from "@clerk/nextjs"

export default function IntroScreen() {
  const {isSignedIn} = useUser()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center gap-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Reduce Food Waste, Save The Planet</h1>
          <p className="text-lg text-green-700 mb-8">
            Track ingredients, discover recipes, and donate surplus food to make a positive environmental impact.
          </p>
          <div className="relative w-full h-128 rounded-xl overflow-hidden mb-8">
            <Image
              src="/TrashFood.png"
              alt="Fresh ingredients and prepared meals"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex items-end">
              <p className="text-white p-6 font-medium">
                Americans waste over 108 billion pounds of food each year. Let's change that together.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <ShoppingBasket className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-green-800">Ingredient Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-green-700 min-h-[60px]">
                Keep track of what's in your pantry and get alerts before food expires.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <UtensilsCrossed className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-green-800">Recipe Maker</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-green-700 min-h-[60px]">
                Discover delicious recipes based on ingredients you already have.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <HeartHandshake className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-green-800">Donation Centers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-green-700 min-h-[60px]">
                Find nearby food banks and donation centers to share surplus food.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {!isSignedIn && (
          <SignUpButton mode="modal">
            <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full text-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </SignUpButton>
        )}
      </main>

    </div>
  )
}
