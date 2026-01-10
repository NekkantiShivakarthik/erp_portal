"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  ClipboardList, 
  BookOpen, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  UserPlus,
  GraduationCap
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { getDemoData } from "@/lib/demo-data"

export default function TeacherDashboard() {
  const supabase = createClient()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    presentCount: 0,
    pendingTasks: 0,
    activeIssues: 0,
    totalTeachers: 0,
    totalClasses: 0
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [classSummary, setClassSummary] = useState<{name: string, count: number}[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    
    try {
      // Get all data in parallel
      const [
        studentsRes,
        attendanceRes,
        issuesRes,
        tasksRes,
        activitiesRes
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('attendance').select('*').eq('date', new Date().toISOString().split('T')[0]),
        supabase.from('infrastructure_issues').select('*', { count: 'exact', head: true }).neq('status', 'resolved'),
        supabase.from('teacher_tasks').select('*', { count: 'exact', head: true }).neq('status', 'completed'),
        supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(5)
      ])

      // Check if we have errors (Supabase unavailable)
      if (studentsRes.error) {
        throw new Error('Supabase unavailable')
      }

      const studentCount = studentsRes.count || 0
      const attendanceData = attendanceRes.data || []
      const presentCount = attendanceData.filter(a => a.status === 'present').length
      const totalAttendanceRecords = attendanceData.length
      const attendancePercentage = totalAttendanceRecords > 0 ? (presentCount / totalAttendanceRecords * 100) : 0
      
      setStats({
        totalStudents: studentCount,
        todayAttendance: attendancePercentage,
        presentCount: presentCount,
        pendingTasks: tasksRes.count || 0,
        activeIssues: issuesRes.count || 0,
        totalTeachers: 0,
        totalClasses: 0
      })
      
      setRecentActivities(activitiesRes.data || [])
      setIsOfflineMode(false)
    } catch (error: any) {
      // Use demo data
      console.warn('Using demo data:', error?.message)
      setIsOfflineMode(true)
      
      const demoStore = getDemoData()
      const demoStats = demoStore.getStats()
      
      setStats({
        totalStudents: demoStats.totalStudents,
        todayAttendance: demoStats.attendanceRate,
        presentCount: demoStats.presentToday,
        pendingTasks: 3,
        activeIssues: demoStats.pendingIssues,
        totalTeachers: demoStats.totalTeachers,
        totalClasses: demoStats.totalClasses
      })
      
      // Create class summary
      const summary = demoStore.classes.map(cls => ({
        name: cls.name,
        count: demoStore.getStudentsByClass(cls.id).length
      })).filter(c => c.count > 0)
      setClassSummary(summary)
      
      setRecentActivities([
        { id: 1, action: 'Attendance marked for Class 10-A', created_at: new Date().toISOString() },
        { id: 2, action: 'New student Amit Patel registered', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, action: 'Infrastructure issue reported', created_at: new Date(Date.now() - 7200000).toISOString() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: t('teacherDashboard.markAttendance'),
      description: t('teacherDashboard.updateAttendance'),
      href: "/dashboard/teacher/attendance",
      icon: ClipboardList,
      color: "bg-blue-500",
    },
    {
      title: t('teacherDashboard.reportChallenge'),
      description: t('teacherDashboard.reportIssues'),
      href: "/dashboard/teacher/challenges",
      icon: AlertTriangle,
      color: "bg-orange-500",
    },
    {
      title: t('teacherDashboard.teachingResources'),
      description: t('teacherDashboard.accessMaterials'),
      href: "/dashboard/teacher/resources",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: t('teacherDashboard.infrastructureIssue'),
      description: t('teacherDashboard.reportFacilityProblems'),
      href: "/dashboard/infrastructure/report",
      icon: AlertTriangle,
      color: "bg-red-500",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const hasNoData = stats.totalStudents === 0

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          {t('teacherDashboard.title')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('teacherDashboard.overview')}
        </p>
      </div>

      {hasNoData && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 dark:border-orange-800">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{t('teacherDashboard.noDataFound')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('teacherDashboard.noDataDesc')}
                </p>
                <Button asChild className="mt-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600" size="sm">
                  <Link href="/dashboard/settings">{t('teacherDashboard.goToSettings')}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stats-card transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.totalStudents')}
            </CardTitle>
            <div className="icon-badge bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('teacherDashboard.students')}</p>
          </CardContent>
        </Card>
        <Card className="stats-card transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950/30 dark:to-emerald-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('teacherDashboard.todayAttendance')}
            </CardTitle>
            <div className="icon-badge bg-green-500/10">
              <ClipboardList className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.todayAttendance.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.presentCount} {t('teacherDashboard.studentsPresent')}</p>
          </CardContent>
        </Card>
        <Card className="stats-card transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-orange-50 to-amber-100/50 dark:from-orange-950/30 dark:to-amber-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('teacherDashboard.pendingTasks')}
            </CardTitle>
            <div className="icon-badge bg-orange-500/10">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700 dark:text-orange-400">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('teacherDashboard.tasksDue')}</p>
          </CardContent>
        </Card>
        <Card className="stats-card transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-red-50 to-rose-100/50 dark:from-red-950/30 dark:to-rose-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('teacherDashboard.activeIssues')}
            </CardTitle>
            <div className="icon-badge bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700 dark:text-red-400">{stats.activeIssues}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('teacherDashboard.unresolvedIssues')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">{t('teacherDashboard.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div className="quick-action-card flex items-center gap-4 p-4 bg-card hover:bg-muted/30 cursor-pointer group">
                  <div className={`rounded-xl p-3 ${action.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold group-hover:text-primary transition-colors">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              {t('dashboard.recentActivities')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  No recent activities. Start by adding data or marking attendance.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="rounded-lg p-2 bg-green-100 dark:bg-green-900/30">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Students by Class - Only show in demo mode when we have data */}
        {isOfflineMode && classSummary.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                </div>
                Students by Class
              </CardTitle>
              <CardDescription>Overview of student distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classSummary.map((cls) => (
                  <div key={cls.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-medium">{cls.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {cls.count} students
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/dashboard/settings">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Students
                  </Link>
                </Button>
                <Button asChild className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600">
                  <Link href="/dashboard/teacher/attendance">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Getting Started Guide - Show only when no demo class data */}
        {(!isOfflineMode || classSummary.length === 0) && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              Getting Started
            </CardTitle>
            <CardDescription>Complete these steps to set up your portal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-card">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stats.totalStudents > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                  <span className={`text-sm font-bold ${stats.totalStudents > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>1</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Add Schools & Classes</p>
                  <p className="text-sm text-muted-foreground">Set up your school structure</p>
                </div>
                {stats.totalStudents > 0 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-card">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stats.totalStudents > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                  <span className={`text-sm font-bold ${stats.totalStudents > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>2</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Add Students</p>
                  <p className="text-sm text-muted-foreground">Register students in classes</p>
                </div>
                {stats.totalStudents > 0 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-card">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground">3</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Mark Attendance</p>
                  <p className="text-sm text-muted-foreground">Start tracking daily attendance</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-card">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground">4</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Report Issues</p>
                  <p className="text-sm text-muted-foreground">Log infrastructure problems</p>
                </div>
              </div>
              <Button asChild className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                <Link href="/dashboard/settings">
                  Go to Settings
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  )
}
