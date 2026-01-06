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
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/i18n/language-context"
import Link from "next/link"

export function Header() {
  const [userName, setUserName] = useState("User")
  const [schoolName, setSchoolName] = useState("")
  const [userInitials, setUserInitials] = useState("U")
  const { t } = useLanguage()

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
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-xl px-4 md:px-6 shadow-sm">
      <SidebarTrigger className="md:hidden">
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      
      <div className="flex flex-1 items-center gap-4">
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {t('header.welcomeBack')}, <span className="text-primary">{userName}</span>
          </h1>
          {schoolName && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {schoolName}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <LanguageSwitcher />
        
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10" suppressHydrationWarning>
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10" suppressHydrationWarning>
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-orange-500 to-red-500 border-2 border-background notification-badge">
                4
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>{t('header.notifications')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="font-medium">{t('header.infraApproved')}</span>
              <span className="text-xs text-muted-foreground">
                {t('header.infraApprovedDesc')}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="font-medium">{t('header.newTraining')}</span>
              <span className="text-xs text-muted-foreground">
                {t('header.newTrainingDesc')}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer hover:bg-primary/5 rounded-lg">
              <span className="font-medium">{t('header.attendanceReminder')}</span>
              <span className="text-xs text-muted-foreground">
                {t('header.attendanceReminderDesc')}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer hover:bg-primary/5 rounded-lg">
              <span className="font-medium">{t('header.monthlyReportDue')}</span>
              <span className="text-xs text-muted-foreground">
                {t('header.monthlyReportDueDesc')}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all" suppressHydrationWarning>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold">{userName}</span>
                <span className="text-xs font-normal text-muted-foreground">{schoolName || t('header.educationPortal')}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">{t('header.myProfile')}</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">{t('header.helpSupport')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="text-red-600 cursor-pointer flex items-center gap-2">{t('header.logout')}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
