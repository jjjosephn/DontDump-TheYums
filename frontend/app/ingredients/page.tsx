"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Search, PlusCircle, Trash2, Edit, ShoppingBag, Filter, Calendar, Package } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import AddIngredientForm from "@/components/AddIngredientForm"

// Mock data based on the schema
const mockIngredients = [
  {
    ingredientId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    ingredientName: "Tomatoes",
    ingredientPicture: "/placeholder.svg?height=80&width=80",
    ingredientDateAdded: new Date("2024-03-15"),
    ingredientDateExpired: new Date("2024-04-15"),
    quantity: 12,
    unit: "pcs",
  },
  {
    ingredientId: "7b16ffcb-6a51-4506-b98c-af32ce6d5a7c",
    ingredientName: "Onions",
    ingredientPicture: "/placeholder.svg?height=80&width=80",
    ingredientDateAdded: new Date("2024-03-10"),
    ingredientDateExpired: new Date("2024-05-10"),
    quantity: 8,
    unit: "pcs",
  },
  {
    ingredientId: "3e7c3f6d-bdf5-46ae-8d90-171300f27ae2",
    ingredientName: "Chicken Breast",
    ingredientPicture: "/placeholder.svg?height=80&width=80",
    ingredientDateAdded: new Date("2024-03-20"),
    ingredientDateExpired: new Date("2024-03-27"),
    quantity: 2.5,
    unit: "kg",
  },
  {
    ingredientId: "5c093af5-9707-46c3-9984-add59e5f5c99",
    ingredientName: "Bell Peppers",
    ingredientPicture: "/placeholder.svg?height=80&width=80",
    ingredientDateAdded: new Date("2024-03-18"),
    ingredientDateExpired: new Date("2024-04-01"),
    quantity: 6,
    unit: "pcs",
  },
  {
    ingredientId: "a8cfde56-74c3-44cf-9cfa-0b3d1633ca48",
    ingredientName: "Pasta",
    ingredientPicture: "/placeholder.svg?height=80&width=80",
    ingredientDateAdded: new Date("2024-02-28"),
    ingredientDateExpired: new Date("2024-08-28"),
    quantity: 5,
    unit: "kg",
  },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all") // all, valid, expired
  const [isFormVisible, setIsFormVisible] = useState(false) // State to control the visibility of the form

  // For handling showing the addNewIngredient form
  const handleAddIngredientClick = () => {
    setIsFormVisible(true); // Show the form when the button is clicked
  };

  const handleCloseForm = () => {
    setIsFormVisible(false); // Hide the form when the form is closed
  };

  // Function to determine if an ingredient is expired
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
    if (activeTab === "all") return matchesSearch
    if (activeTab === "valid") return matchesSearch && !isExpired(ingredient.ingredientDateExpired)
    if (activeTab === "expired") return matchesSearch && isExpired(ingredient.ingredientDateExpired)
    return matchesSearch
  })

  // Count statistics
  const expiredCount = mockIngredients.filter((i) => isExpired(i.ingredientDateExpired)).length
  const expiringSoonCount = mockIngredients.filter(
    (i) => !isExpired(i.ingredientDateExpired) && daysRemaining(i.ingredientDateExpired) <= 7,
  ).length
  const validCount = mockIngredients.length - expiredCount - expiringSoonCount

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <ShoppingBag className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Kitchen Inventory</h1>
              <p className="text-slate-500">Manage your ingredients efficiently</p>
            </div>
          </div>
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={ handleAddIngredientClick }>
            <PlusCircle className="h-4 w-4" /> Add New Ingredient
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Ingredients</p>
                  <h3 className="text-3xl font-bold mt-1 text-slate-800">{mockIngredients.length}</h3>
                </div>
                <div className="bg-slate-100 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-slate-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-500">
                <span className="text-emerald-600 font-medium">{validCount} valid</span> ingredients in stock
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Expiring Soon</p>
                  <h3 className="text-3xl font-bold mt-1 text-amber-600">{expiringSoonCount}</h3>
                </div>
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-500">
                <span className="text-amber-600 font-medium">Expiring</span> within 7 days
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Expired Items</p>
                  <h3 className="text-3xl font-bold mt-1 text-rose-600">{expiredCount}</h3>
                </div>
                <div className="bg-rose-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-rose-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-500">
                <span className="text-rose-600 font-medium">{expiredCount > 0 ? "Action needed" : "All good!"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-emerald-100">Inventory Health</p>
                  <h3 className="text-3xl font-bold mt-1">
                    {expiredCount === 0 ? "Excellent" : expiredCount > 2 ? "Poor" : "Good"}
                  </h3>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Filter className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-4 text-sm text-emerald-100">
                {expiredCount === 0 ? "No expired items" : `${expiredCount} items need attention`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Ingredient Form */}
        {isFormVisible && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-transparent"
              onClick={handleCloseForm} // Close the form if the user clicks outside
            ></div>

            <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-10">
              <AddIngredientForm onClose={handleCloseForm} /> {/* Pass a close handler */}
            </div>
          </div>
        )}

        {/* Main Content */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 bg-white border-b">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Search ingredients..."
                    className="pl-9 border-slate-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full sm:w-auto grid-cols-3 h-9">
                    <TabsTrigger value="all" className="text-xs sm:text-sm">
                      All Items
                    </TabsTrigger>
                    <TabsTrigger value="valid" className="text-xs sm:text-sm">
                      Valid
                    </TabsTrigger>
                    <TabsTrigger value="expired" className="text-xs sm:text-sm">
                      Expired
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
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
                    const isItemExpired = isExpired(ingredient.ingredientDateExpired)
                    const daysLeft = daysRemaining(ingredient.ingredientDateExpired)

                    return (
                      <TableRow
                        key={ingredient.ingredientId}
                        className={isItemExpired ? "bg-rose-50" : daysLeft <= 7 ? "bg-amber-50" : ""}
                      >
                        <TableCell>
                          <Avatar className="h-10 w-10 rounded-md">
                            <AvatarImage src={ingredient.ingredientPicture} alt={ingredient.ingredientName} />
                            <AvatarFallback className="rounded-md bg-slate-100 text-slate-500">
                              {ingredient.ingredientName.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{ingredient.ingredientName}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-slate-500">
                          {format(ingredient.ingredientDateAdded, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{format(ingredient.ingredientDateExpired, "MMM dd, yyyy")}</div>
                          {!isItemExpired && (
                            <div className={`text-xs ${daysLeft <= 7 ? "text-amber-600" : "text-slate-500"}`}>
                              {daysLeft > 0 ? `${daysLeft} days left` : "Expires today"}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{ingredient.quantity}</span> {ingredient.unit}
                        </TableCell>
                        <TableCell>
                          {isItemExpired ? (
                            <Badge
                              variant="outline"
                              className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200"
                            >
                              Expired
                            </Badge>
                          ) : daysLeft <= 7 ? (
                            <Badge
                              variant="outline"
                              className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"
                            >
                              Expiring Soon
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                            >
                              Valid
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filteredIngredients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <Package className="h-12 w-12 text-slate-300 mb-3" />
                          <p className="text-lg font-medium mb-1">No ingredients found</p>
                          <p className="text-sm text-slate-400">
                            {searchTerm ? "Try a different search term" : "Add some ingredients to get started"}
                          </p>
                        </div>
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
  )
}

