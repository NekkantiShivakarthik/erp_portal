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
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger className="md:hidden">
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      
      <div className="flex flex-1 items-center gap-4">
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold">{t('header.welcomeBack')}, {userName}</h1>
          {schoolName && <p className="text-sm text-muted-foreground">{schoolName}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        
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
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="font-medium">{t('header.attendanceReminder')}</span>
              <span className="text-xs text-muted-foreground">
                {t('header.attendanceReminderDesc')}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="font-medium">{t('header.monthlyReportDue')}</span>
              <span className="text-xs text-muted-foreground">
                {t('header.monthlyReportDueDesc')}
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
                <span className="text-xs font-normal text-muted-foreground">{schoolName || t('header.educationPortal')}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('header.myProfile')}</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>{t('header.helpSupport')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="text-red-600 cursor-pointer">{t('header.logout')}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
