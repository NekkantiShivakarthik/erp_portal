"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  FileText,
  Settings,
  BookOpen,
  Building2,
  Camera,
  TrendingUp,
  Wallet,
  Video,
  AlertTriangle,
  CheckCircle,
  LogOut,
  HelpCircle,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

export function SidebarNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [userName, setUserName] = useState("User")
  const [userInitials, setUserInitials] = useState("U")
  const [userRole, setUserRole] = useState("Teacher")
  const [employeeId, setEmployeeId] = useState("")
  const [userType, setUserType] = useState("")

  const studentNavItems = [
    {
      title: t('sidebar.dashboard'),
      href: "/dashboard/student",
      icon: LayoutDashboard,
    },
    {
      title: t('sidebar.learningResources'),
      href: "/dashboard/student/resources",
      icon: BookOpen,
    },
    {
      title: t('sidebar.infrastructureReports'),
      href: "/dashboard/student/infrastructure",
      icon: Building2,
    },
  ]

  const teacherNavItems = [
    {
      title: t('sidebar.dashboard'),
      href: "/dashboard/teacher",
      icon: LayoutDashboard,
    },
    {
      title: t('sidebar.attendance'),
      href: "/dashboard/teacher/attendance",
      icon: ClipboardList,
    },
    {
      title: t('sidebar.classroomChallenges'),
      href: "/dashboard/teacher/challenges",
      icon: AlertTriangle,
    },
    {
      title: t('sidebar.teachingResources'),
      href: "/dashboard/teacher/resources",
      icon: BookOpen,
    },
    {
      title: t('sidebar.trainingWorkshops'),
      href: "/dashboard/teacher/training",
      icon: Video,
    },
  ]

  const infrastructureItems = [
    {
      title: t('sidebar.infrastructureStatus'),
      href: "/dashboard/infrastructure",
      icon: Building2,
    },
    {
      title: t('sidebar.reportIssues'),
      href: "/dashboard/infrastructure/report",
      icon: Camera,
    },
    {
      title: t('sidebar.trackRequests'),
      href: "/dashboard/infrastructure/track",
      icon: CheckCircle,
    },
  ]

  const managementItems = [
    {
      title: t('sidebar.monitoringPanel'),
      href: "/dashboard/monitoring",
      icon: TrendingUp,
    },
    {
      title: t('sidebar.fundAllocation'),
      href: "/dashboard/funds",
      icon: Wallet,
    },
    {
      title: t('sidebar.reports'),
      href: "/dashboard/reports",
      icon: FileText,
    },
    {
      title: t('common.settings'),
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  useEffect(() => {
    const loadUserInfo = () => {
      const storedName = localStorage.getItem('userName')
      const storedRole = localStorage.getItem('userType')
      const storedEmployeeId = localStorage.getItem('employeeId')
      const storedRollNumber = localStorage.getItem('rollNumber')
      
      if (storedName) {
        setUserName(storedName)
        const initials = storedName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        setUserInitials(initials)
      }
      
      if (storedRole) {
        setUserType(storedRole)
        setUserRole(storedRole.charAt(0).toUpperCase() + storedRole.slice(1))
      }
      
      if (storedEmployeeId) {
        setEmployeeId(storedEmployeeId)
      } else if (storedRollNumber) {
        setEmployeeId(storedRollNumber)
      }
    }
    
    loadUserInfo()
    
    // Listen for storage changes
    window.addEventListener('storage', loadUserInfo)
    return () => window.removeEventListener('storage', loadUserInfo)
  }, [])

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="border-b px-6 py-5 bg-gradient-to-b from-sidebar to-sidebar/95">
        <Link href="/dashboard/teacher" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg group-hover:shadow-orange-500/30 transition-shadow">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              ShikshaSetu
            </span>
            <span className="text-xs text-sidebar-foreground/60">Government Portal</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        {userType === 'student' ? (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-wider mb-2">{t('sidebar.studentMenu')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {studentNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} className={`rounded-xl py-3 transition-all ${pathname === item.href ? 'bg-sidebar-accent shadow-md' : 'hover:bg-sidebar-accent/50'}`}>
                      <Link href={item.href} className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${pathname === item.href ? 'bg-primary text-primary-foreground' : 'bg-sidebar-accent'}`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-wider mb-2">{t('sidebar.teacherMenu')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {teacherNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} className={`rounded-xl py-3 transition-all ${pathname === item.href ? 'bg-sidebar-accent shadow-md' : 'hover:bg-sidebar-accent/50'}`}>
                        <Link href={item.href} className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${pathname === item.href ? 'bg-primary text-primary-foreground' : 'bg-sidebar-accent'}`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-wider mb-2">{t('sidebar.infrastructure')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {infrastructureItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} className={`rounded-xl py-3 transition-all ${pathname === item.href ? 'bg-sidebar-accent shadow-md' : 'hover:bg-sidebar-accent/50'}`}>
                        <Link href={item.href} className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${pathname === item.href ? 'bg-primary text-primary-foreground' : 'bg-sidebar-accent'}`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-wider mb-2">{t('sidebar.management')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {managementItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} className={`rounded-xl py-3 transition-all ${pathname === item.href ? 'bg-sidebar-accent shadow-md' : 'hover:bg-sidebar-accent/50'}`}>
                        <Link href={item.href} className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${pathname === item.href ? 'bg-primary text-primary-foreground' : 'bg-sidebar-accent'}`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t p-4 bg-gradient-to-t from-sidebar to-sidebar/95">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-sidebar-accent/50">
          <Avatar className="h-10 w-10 ring-2 ring-primary/30">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-500 text-white font-semibold">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold truncate">{userName}</span>
            <span className="text-xs text-sidebar-foreground/60 truncate">{userRole} • {employeeId}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-sidebar-accent hover:bg-sidebar-accent/80 border-sidebar-border" asChild>
            <Link href="/dashboard/settings">
              <HelpCircle className="h-4 w-4 mr-1" />
              {t('common.help')}
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-sidebar-accent hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border-sidebar-border" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4 mr-1" />
              {t('common.logout')}
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
