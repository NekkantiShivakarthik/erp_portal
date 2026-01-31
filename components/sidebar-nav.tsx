"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
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
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-800 px-6 py-5 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/50">
        <Link href="/dashboard/teacher" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:shadow-blue-400/40 transition-all group-hover:scale-110 group-hover:rotate-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              ShikshaSetu
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Government Portal</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-background">
        {userType === 'student' ? (
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider mb-2 flex items-center gap-1">{t('sidebar.studentMenu')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {studentNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} className={`rounded-2xl py-3 transition-all ${pathname === item.href ? 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700/50 shadow-md border-2 border-slate-200 dark:border-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                      <Link href={item.href} className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${pathname === item.href ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
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
              <SidebarGroupLabel className="text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider mb-2 flex items-center gap-1">{t('sidebar.teacherMenu')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {teacherNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} className={`rounded-2xl py-3 transition-all ${pathname === item.href ? 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700/50 shadow-md border-2 border-slate-200 dark:border-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <Link href={item.href} className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${pathname === item.href ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
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
              <SidebarGroupLabel className="text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider mb-2 flex items-center gap-1">{t('sidebar.infrastructure')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {infrastructureItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} className={`rounded-2xl py-3 transition-all ${pathname === item.href ? 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-md border-2 border-slate-200 dark:border-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <Link href={item.href} className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${pathname === item.href ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
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
              <SidebarGroupLabel className="text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider mb-2 flex items-center gap-1">{t('sidebar.management')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {managementItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} className={`rounded-2xl py-3 transition-all ${pathname === item.href ? 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-md border-2 border-slate-200 dark:border-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <Link href={item.href} className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${pathname === item.href ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
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
      <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 p-4 bg-gradient-to-t from-slate-50 to-slate-100/30 dark:from-slate-900 dark:to-slate-800/30">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-gradient-to-r from-slate-100/80 to-slate-50 dark:from-slate-800 dark:to-slate-700/50 border-2 border-slate-200/50 dark:border-slate-700/50">
          <Avatar className="h-10 w-10 ring-2 ring-slate-300/50 dark:ring-slate-600/50">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold truncate">{userName}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 truncate">{userRole} • {employeeId}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300" asChild>
            <Link href="/dashboard/settings">
              <HelpCircle className="h-4 w-4 mr-1" />
              {t('common.help')}
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-slate-50 hover:bg-red-100 dark:bg-slate-800/50 dark:hover:bg-red-900/30 hover:text-red-500 hover:border-red-300 border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300" asChild>
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
