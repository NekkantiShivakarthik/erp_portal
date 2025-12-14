"use client"

import { useState, useEffect } from "react"
import { Bell, Menu, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export function Header() {
  const [userName, setUserName] = useState("User")
  const [schoolName, setSchoolName] = useState("")
  const [userInitials, setUserInitials] = useState("U")

  useEffect(() => {
    const loadUserInfo = () => {
      // Get user info from localStorage (set during login)
      const storedName = localStorage.getItem('userName')
      const storedSchool = localStorage.getItem('schoolName')
      const userType = localStorage.getItem('userType')
      
      if (storedName) {
        setUserName(storedName)
        const initials = storedName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        setUserInitials(initials)
      } else {
        setUserName("User")
        setUserInitials("U")
      }
      
      if (storedSchool) {
        setSchoolName(storedSchool)
      } else if (userType === 'official') {
        setSchoolName('Education Department')
      } else {
        setSchoolName("")
      }
    }
    
    // Load on mount
    loadUserInfo()
    
    // Listen for storage changes (for logout/login in same tab)
    const handleStorageChange = () => {
      loadUserInfo()
    }
    
    // Listen for custom login event
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userLogin', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userLogin', handleStorageChange)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger className="md:hidden">
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      
      <div className="flex flex-1 items-center gap-4">
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold">Welcome back, {userName}</h1>
          {schoolName && <p className="text-sm text-muted-foreground">{schoolName}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" suppressHydrationWarning>
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" suppressHydrationWarning>
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-orange-500">
                4
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="font-medium">Infrastructure Request Approved</span>
              <span className="text-xs text-muted-foreground">
                Your request for 10 new benches has been approved
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="font-medium">New Training Workshop</span>
              <span className="text-xs text-muted-foreground">
                Digital Teaching Methods - Dec 20, 2024
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="font-medium">Attendance Reminder</span>
              <span className="text-xs text-muted-foreground">
                Please update today's attendance by 3:00 PM
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="font-medium">Monthly Report Due</span>
              <span className="text-xs text-muted-foreground">
                Submit your classroom report by Dec 15
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" suppressHydrationWarning>
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-primary/10 text-primary">{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{userName}</span>
                <span className="text-xs font-normal text-muted-foreground">{schoolName || 'Education Portal'}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>My Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="text-red-600 cursor-pointer">Log out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
