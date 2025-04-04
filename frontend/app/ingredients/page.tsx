"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { Search, PlusCircle, Trash2, Edit, ShoppingBag } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Mock data based on the schema
const mockIngredients = [
  {
    ingredientId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    ingredientName: "Tomatoes",
    ingredientPicture: "/placeholder.svg?height=80&width=80",
    ingredientDateAdded: new Date("2024-03-15"),
    ingredientDateExpired: new Date("2024-04-15"),
    quantity: 12,
    unit: "pcs"
  },
  {
    ingredientId: "7b16ffcb-6a51-4506-b98c-af32ce6d5a7c",
    ingredientName: "Onions",
    ingredientPicture: "/placeholder.svg?height=80&width=80",
    ingredientDateAdded: new Date("2024-03-10"),
    ingredientDateExpired: new Date("2024-05-10"),
    quantity: 8,
    unit: "pcs"
  },
  {
    ingredientId: "3e7c3f6d-bdf5-46ae-8d90-171300f27ae2",
    ingredientName: "Chicken Breast",
    ingredientPicture: "/placeholder.svg?height=80&width=80",
    ingredientDateAdded: new Date("2024-03-20"),
    ingredientDateExpired: new Date("2024-03-27"),
    quantity: 2.5,
    unit: "kg"
  },
  {
    ingredientId: "5c093af5-9707-46c3-9984-add59e5f5c99",
    ingredientName: "Bell Peppers",
    ingredientPicture: "/placeholder.svg?height=80&width=80",
    ingredientDateAdded: new Date("2024-03-18"),
    ingredientDateExpired: new Date("2024-04-01"),
    quantity: 6,
    unit: "pcs"
  },
  {
    ingredientId: "a8cfde56-74c3-44cf-9cfa-0b3d1633ca48",
    ingredientName: "Pasta",
    ingredientPicture: "/placeholder.svg?height=80&width=80",
    ingredientDateAdded: new Date("2024-02-28"),
    ingredientDateExpired: new Date("2024-08-28"),
    quantity: 5,
    unit: "kg"
  },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState("all") // all, valid, expired

  // Function to determine if an ingredient is expired - MOVED THIS UP
  const isExpired = (expiryDate) => {
    return new Date() > expiryDate
  }

  // Function to calculate days remaining until expiry
  const daysRemaining = (expiryDate) => {
    const today = new Date()
    const diffTime = expiryDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredIngredients = mockIngredients.filter((ingredient) => {
    const matchesSearch = ingredient.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())
    if (view === "all") return matchesSearch
    if (view === "valid") return matchesSearch && !isExpired(ingredient.ingredientDateExpired)
    if (view === "expired") return matchesSearch && isExpired(ingredient.ingredientDateExpired)
    return matchesSearch
  })

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Kitchen Inventory</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setView("all")} 
              className={view === "all" ? "bg-blue-100" : ""}>
              All Items
            </Button>
            <Button variant="outline" size="sm" onClick={() => setView("valid")} 
              className={view === "valid" ? "bg-blue-100" : ""}>
              Valid
            </Button>
            <Button variant="outline" size="sm" onClick={() => setView("expired")} 
              className={view === "expired" ? "bg-blue-100" : ""}>
              Expired
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="relative mb-4 mt-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search ingredients..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="w-full mb-4 gap-2">
                  <PlusCircle className="h-4 w-4" /> Add New Item
                </Button>
                <div className="mt-6">
                  <h3 className="font-medium text-sm text-slate-500 mb-2">INVENTORY SUMMARY</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-100 p-3 rounded-md">
                      <div className="text-xl font-bold">{mockIngredients.length}</div>
                      <div className="text-sm text-slate-600">Total Items</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-md">
                      <div className="text-xl font-bold text-red-600">
                        {mockIngredients.filter(i => isExpired(i.ingredientDateExpired)).length}
                      </div>
                      <div className="text-sm text-red-600">Expired Items</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <div className="text-xl font-bold text-yellow-600">
                        {mockIngredients.filter(i => !isExpired(i.ingredientDateExpired) && daysRemaining(i.ingredientDateExpired) <= 7).length}
                      </div>
                      <div className="text-sm text-yellow-600">Expiring Soon</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main inventory table */}
          <div className="md:col-span-3">
            <Card>
              <CardContent className="p-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-100">
                      <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Added</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIngredients.map((ingredient) => {
                        const isItemExpired = isExpired(ingredient.ingredientDateExpired);
                        const daysLeft = daysRemaining(ingredient.ingredientDateExpired);
                        
                        return (
                          <TableRow key={ingredient.ingredientId} className={
                            isItemExpired 
                              ? "bg-red-50" 
                              : daysLeft <= 7 
                                ? "bg-yellow-50" 
                                : ""
                          }>
                            <TableCell>
                              <div className="h-12 w-12 relative rounded-md overflow-hidden border">
                                <Image
                                  src={ingredient.ingredientPicture}
                                  alt={ingredient.ingredientName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{ingredient.ingredientName}</TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-slate-500">
                              {format(ingredient.ingredientDateAdded, "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell>
                              <div>{format(ingredient.ingredientDateExpired, "MMM dd, yyyy")}</div>
                              {!isItemExpired && (
                                <div className="text-xs text-slate-500">
                                  {daysLeft > 0 ? `${daysLeft} days left` : "Expires today"}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{ingredient.quantity}</span> {ingredient.unit}
                            </TableCell>
                            <TableCell>
                              {isItemExpired ? (
                                <Badge variant="destructive" className="font-normal">Expired</Badge>
                              ) : daysLeft <= 7 ? (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 font-normal">
                                  Expiring Soon
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 font-normal">
                                  Valid
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {filteredIngredients.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                            No ingredients found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}