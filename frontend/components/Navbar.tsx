"use client"

import { Leaf } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from "@clerk/nextjs"
import { CustomUserButton } from "./CustomUserButton"

const Navbar = () => {
  const { user } = useUser()
  const firstName = user?.firstName || ""
  const lastName = user?.lastName || ""

  return (
    <header className="pl-5 pr-5 w-full sticky top-0 bg-amber-50 z-50 border-b ">
      <div className="flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-full">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">DontDump TheYums</h1>
        </div>
        <SignedIn>
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
            <CustomUserButton />
            
          </nav>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-full flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  )
}

export default Navbar
