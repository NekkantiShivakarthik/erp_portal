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
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b-2 border-pink-200/50 dark:border-pink-800/30 bg-gradient-to-r from-pink-50/90 via-white/90 to-purple-50/90 dark:from-pink-950/80 dark:via-background/90 dark:to-purple-950/80 backdrop-blur-xl px-4 md:px-6 shadow-sm">
      <SidebarTrigger className="md:hidden">
        <Menu className="h-5 w-5 text-pink-500" />
      </SidebarTrigger>
      
      <div className="flex flex-1 items-center gap-4">
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold">
            {t('header.welcomeBack')}, <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{userName}</span> ✨
          </h1>
          {schoolName && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              {schoolName} 🏫
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <LanguageSwitcher />
        
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30 text-pink-500" suppressHydrationWarning>
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30 text-pink-500" suppressHydrationWarning>
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-pink-500 to-rose-500 border-2 border-background notification-badge">
                4
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 border-2 border-pink-200/50 dark:border-pink-800/30 rounded-2xl">
            <DropdownMenuLabel className="flex items-center gap-2">🔔 {t('header.notifications')}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-pink-200/50 dark:bg-pink-800/30" />
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20">
              <span className="font-medium">✅ {t('header.infraApproved')}</span>
              <span className="text-xs text-muted-foreground">
                {t('header.infraApprovedDesc')}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20">
              <span className="font-medium">📚 {t('header.newTraining')}</span>
              <span className="text-xs text-muted-foreground">
                {t('header.newTrainingDesc')}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20">
              <span className="font-medium">📋 {t('header.attendanceReminder')}</span>
              <span className="text-xs text-muted-foreground">
                {t('header.attendanceReminderDesc')}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20">
              <span className="font-medium">📊 {t('header.monthlyReportDue')}</span>
              <span className="text-xs text-muted-foreground">
                {t('header.monthlyReportDueDesc')}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-pink-300/50 hover:ring-pink-400/60 dark:ring-pink-600/30 dark:hover:ring-pink-500/50 transition-all" suppressHydrationWarning>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white font-semibold">{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-2 border-pink-200/50 dark:border-pink-800/30 rounded-2xl">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold">{userName} ✨</span>
                <span className="text-xs font-normal text-muted-foreground">{schoolName || t('header.educationPortal')}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-pink-200/50 dark:bg-pink-800/30" />
            <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20">👤 {t('header.myProfile')}</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20">⚙️ Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20">💝 {t('header.helpSupport')}</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-pink-200/50 dark:bg-pink-800/30" />
            <DropdownMenuItem asChild>
              <Link href="/" className="text-red-500 cursor-pointer flex items-center gap-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">👋 {t('header.logout')}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
