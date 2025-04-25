import { CalendarClock, Plus } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

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
          </nav>
        </div>
      </header>
   )
}

export default Navbar