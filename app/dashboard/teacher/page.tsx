"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function TeacherDashboard() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    presentCount: 0,
    pendingTasks: 0,
    activeIssues: 0
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])

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
        activeIssues: issuesRes.count || 0
      })
      
      setRecentActivities(activitiesRes.data || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: "Mark Attendance",
      description: "Update today's student attendance",
      href: "/dashboard/teacher/attendance",
      icon: ClipboardList,
      color: "bg-blue-500",
    },
    {
      title: "Report Challenge",
      description: "Report classroom issues",
      href: "/dashboard/teacher/challenges",
      icon: AlertTriangle,
      color: "bg-orange-500",
    },
    {
      title: "Teaching Resources",
      description: "Access learning materials",
      href: "/dashboard/teacher/resources",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Infrastructure Issue",
      description: "Report school facility problems",
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your classes, attendance, and pending tasks
        </p>
      </div>

      {hasNoData && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-10 w-10 text-orange-500" />
              <div>
                <h3 className="font-medium">No Data Found</h3>
                <p className="text-sm text-muted-foreground">
                  Start by adding schools, teachers, classes, and students in the Settings page.
                </p>
                <Button asChild className="mt-2" size="sm">
                  <Link href="/dashboard/settings">Go to Settings</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <div className="rounded-lg p-2 bg-blue-100">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Attendance
            </CardTitle>
            <div className="rounded-lg p-2 bg-green-100">
              <ClipboardList className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAttendance.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{stats.presentCount} present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Tasks
            </CardTitle>
            <div className="rounded-lg p-2 bg-orange-100">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Action required</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Issues
            </CardTitle>
            <div className="rounded-lg p-2 bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeIssues}</div>
            <p className="text-xs text-muted-foreground">Infrastructure issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className={`rounded-lg p-3 ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest actions in the portal</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No recent activities. Start by adding data or marking attendance.
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="rounded-lg p-2 bg-muted">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm">{activity.action}</p>
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

        {/* Getting Started Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Steps to set up your portal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 ${stats.totalStudents > 0 ? 'bg-green-100' : 'bg-muted'}`}>
                  <span className={`text-sm font-medium ${stats.totalStudents > 0 ? 'text-green-600' : ''}`}>1</span>
                </div>
                <div>
                  <p className="font-medium">Add Schools & Classes</p>
                  <p className="text-sm text-muted-foreground">Set up your school structure</p>
                </div>
                {stats.totalStudents > 0 && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
              </div>
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 ${stats.totalStudents > 0 ? 'bg-green-100' : 'bg-muted'}`}>
                  <span className={`text-sm font-medium ${stats.totalStudents > 0 ? 'text-green-600' : ''}`}>2</span>
                </div>
                <div>
                  <p className="font-medium">Add Students</p>
                  <p className="text-sm text-muted-foreground">Register students in classes</p>
                </div>
                {stats.totalStudents > 0 && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full p-2 bg-muted">
                  <span className="text-sm font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium">Mark Attendance</p>
                  <p className="text-sm text-muted-foreground">Start tracking daily attendance</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full p-2 bg-muted">
                  <span className="text-sm font-medium">4</span>
                </div>
                <div>
                  <p className="font-medium">Report Issues</p>
                  <p className="text-sm text-muted-foreground">Log infrastructure problems</p>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/dashboard/settings">
                  Go to Settings
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
