import { CalendarClock, Plus } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from './ui/label'
import { Input } from './ui/input'

const Navbar = () => {
   return (
      <header className="pl-5 pr-5 w-full sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">DontDump TheYums</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/ingredients">Ingredients</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/recipes">Recipes</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/donate">Donate</Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Food Item</DialogTitle>
                  <DialogDescription>
                    Enter the details of the food item you want to add to your inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" placeholder="e.g. Milk" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input id="quantity" placeholder="e.g. 1 gallon" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="produce">Produce</SelectItem>
                        <SelectItem value="meat">Meat & Seafood</SelectItem>
                        <SelectItem value="pantry">Pantry</SelectItem>
                        <SelectItem value="frozen">Frozen</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="storage" className="text-right">
                      Storage
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select storage location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fridge">Refrigerator</SelectItem>
                        <SelectItem value="freezer">Freezer</SelectItem>
                        <SelectItem value="pantry">Pantry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expiry" className="text-right">
                      Expiry Date
                    </Label>
                    <Input id="expiry" type="date" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </header>
   )
}

export default Navbar