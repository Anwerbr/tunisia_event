'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MapPin, User, LogOut, Calendar, LayoutDashboard, Plus, Ticket } from 'lucide-react'

export function Navbar() {
  const { user, logout, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <MapPin className="h-6 w-6" />
          <span className="text-xl font-bold">TunisiaEvents</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">
            Browse Events
          </Link>
          {user?.role === 'organizer' && (
            <Link href="/events/create" className="text-sm font-medium hover:text-primary transition-colors">
              Create Event
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.full_name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    My Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <Ticket className="h-4 w-4" />
                    My Tickets
                  </Link>
                </DropdownMenuItem>
                {user.role === 'organizer' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/organizer" className="flex items-center gap-2 cursor-pointer">
                        <Calendar className="h-4 w-4" />
                        Organizer Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/events/create" className="flex items-center gap-2 cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Create Event
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logout()} 
                  className="flex items-center gap-2 cursor-pointer text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
