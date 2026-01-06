"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  School,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wallet,
  BarChart3,
  Eye,
  FileText,
  Building2,
  Loader2,
  AlertCircle,
  WifiOff,
  GraduationCap
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getDemoData } from "@/lib/demo-data"
import { toast } from "sonner"

export default function OfficialDashboard() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [districtOverview, setDistrictOverview] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    avgAttendance: 0,
    infrastructureIssues: 0,
    resolvedThisMonth: 0,
    fundsAllocated: 0,
    fundsUtilized: 0,
    utilizationRate: 0,
  })
  const [alerts, setAlerts] = useState<any[]>([])
  const [topSchools, setTopSchools] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDemoData = () => {
    const demoStore = getDemoData()
    const stats = demoStore.getStats()
    
    // Calculate attendance from demo data
    const today = new Date().toISOString().split('T')[0]
    const todayAttendance = demoStore.attendance.filter(a => a.date === today)
    const presentCount = todayAttendance.filter(a => a.status === 'present').length
    const avgAttendance = todayAttendance.length > 0 ? (presentCount / todayAttendance.length * 100) : 85 // Default to 85% if no data
    
    // Demo funds
    const fundsAllocated = 2500000 // 25 Lakhs
    const fundsUtilized = 1800000 // 18 Lakhs
    
    setDistrictOverview({
      totalSchools: stats.totalSchools,
      totalStudents: stats.totalStudents,
      totalTeachers: stats.totalTeachers,
      avgAttendance: avgAttendance,
      infrastructureIssues: stats.pendingIssues,
      resolvedThisMonth: 3,
      fundsAllocated: fundsAllocated,
      fundsUtilized: fundsUtilized,
      utilizationRate: (fundsUtilized / fundsAllocated * 100),
    })
    
    setTopSchools(demoStore.schools)
    setIsOfflineMode(true)
  }

  const loadDashboardData = async () => {
    setLoading(true)
    
    try {
      // Get all data in parallel
      const [schoolsRes, studentsRes, teachersRes, issuesRes, alertsRes, fundsRes, attendanceRes, schoolsDataRes] = await Promise.all([
        supabase.from('schools').select('*', { count: 'exact' }),
        supabase.from('students').select('*', { count: 'exact' }),
        supabase.from('teachers').select('*', { count: 'exact' }),
        supabase.from('infrastructure_issues').select('*'),
        supabase.from('alerts').select('*, schools(name)').eq('is_resolved', false).limit(5),
        supabase.from('funds').select('*'),
        supabase.from('attendance').select('*').eq('date', new Date().toISOString().split('T')[0]),
        supabase.from('schools').select('*').limit(5)
      ])

      // Check if we got data from Supabase
      if (schoolsRes.error || !schoolsRes.data) {
        loadDemoData()
        return
      }

      // Calculate attendance
      const attendanceData = attendanceRes.data || []
      const presentCount = attendanceData.filter(a => a.status === 'present').length
      const totalAttendance = attendanceData.length
      const avgAttendance = totalAttendance > 0 ? (presentCount / totalAttendance * 100) : 0
      
      // Calculate funds
      const fundsData = fundsRes.data || []
      const totalAllocated = fundsData.reduce((sum, f) => sum + (f.allocated_amount || 0), 0)
      const totalUtilized = fundsData.reduce((sum, f) => sum + (f.utilized_amount || 0), 0)
      const utilizationRate = totalAllocated > 0 ? (totalUtilized / totalAllocated * 100) : 0

      // Calculate infrastructure issues
      const issuesData = issuesRes.data || []
      const activeIssues = issuesData.filter(i => i.status !== 'resolved').length
      
      // Get resolved issues this month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      const resolvedCount = issuesData.filter(i => 
        i.status === 'resolved' && 
        i.resolved_date &&
        new Date(i.resolved_date) >= startOfMonth
      ).length
      
      setDistrictOverview({
        totalSchools: schoolsRes.count || 0,
        totalStudents: studentsRes.count || 0,
        totalTeachers: teachersRes.count || 0,
        avgAttendance: avgAttendance,
        infrastructureIssues: activeIssues,
        resolvedThisMonth: resolvedCount,
        fundsAllocated: totalAllocated,
        fundsUtilized: totalUtilized,
        utilizationRate: utilizationRate,
      })
      
      // Set alerts without showing toasts (too spammy on reload)
      const alertsData = alertsRes.data || []
      setAlerts(alertsData)
      
      setTopSchools(schoolsDataRes.data || [])
    } catch (error: any) {
      // Tables may not exist yet - use demo data
      console.warn('Dashboard data not available, using demo data:', error?.message)
      loadDemoData()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const hasNoData = districtOverview.totalSchools === 0

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isOfflineMode && (
        <Card className="border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-600">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <WifiOff className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-800 dark:text-amber-300">Demo Mode Active</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Showing demo district data. All features work with local data.
                </p>
              </div>
              <Badge variant="outline" className="border-amber-500 text-amber-700">
                <GraduationCap className="h-3 w-3 mr-1" />
                Demo
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Official Dashboard</h1>
          <p className="text-muted-foreground">
            District Education Office Overview
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/monitoring">
            <Eye className="h-4 w-4 mr-2" />
            View All Schools
          </Link>
        </Button>
      </div>

      {hasNoData && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-10 w-10 text-orange-500" />
              <div>
                <h3 className="font-medium">No Data Found</h3>
                <p className="text-sm text-muted-foreground">
                  Start by adding schools, teachers, and students in the Settings page.
                </p>
                <Button asChild className="mt-2" size="sm">
                  <Link href="/dashboard/settings">Go to Settings</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Schools
            </CardTitle>
            <School className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{districtOverview.totalSchools}</div>
            <p className="text-xs text-muted-foreground">
              {districtOverview.totalStudents.toLocaleString()} students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              District Attendance
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{districtOverview.avgAttendance.toFixed(1)}%</span>
              {districtOverview.avgAttendance > 0 && <TrendingUp className="h-4 w-4 text-green-600" />}
            </div>
            <p className="text-xs text-muted-foreground">Today's attendance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Infrastructure Issues
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{districtOverview.infrastructureIssues}</div>
            <p className="text-xs text-muted-foreground">
              {districtOverview.resolvedThisMonth} resolved this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fund Utilization
            </CardTitle>
            <Wallet className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{districtOverview.utilizationRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              ₹{(districtOverview.fundsUtilized / 100000).toFixed(1)}L of ₹{(districtOverview.fundsAllocated / 100000).toFixed(1)}L
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts ({alerts.length})
            </CardTitle>
            <CardDescription>Issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between bg-white rounded-lg p-4 border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${
                      alert.severity === "critical" ? "bg-red-500" :
                      alert.severity === "high" ? "bg-orange-500" : "bg-yellow-500"
                    }`} />
                    <div>
                      <p className="font-medium">{(alert.schools as any)?.name || 'School'}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  <Badge variant={
                    alert.severity === "critical" ? "destructive" :
                    alert.severity === "high" ? "default" : "secondary"
                  }>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Schools Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5 text-blue-600" />
              Registered Schools
            </CardTitle>
            <CardDescription>Schools in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {topSchools.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No schools registered yet. Add schools in Settings.
              </p>
            ) : (
              <div className="space-y-4">
                {topSchools.map((school) => (
                  <div key={school.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{school.name}</span>
                      <Badge variant="outline">{school.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{school.district}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              System Summary
            </CardTitle>
            <CardDescription>Overall statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <School className="h-5 w-5 text-blue-600" />
                  <span>Total Schools</span>
                </div>
                <span className="font-bold">{districtOverview.totalSchools}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Total Students</span>
                </div>
                <span className="font-bold">{districtOverview.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Total Teachers</span>
                </div>
                <span className="font-bold">{districtOverview.totalTeachers}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Open Issues</span>
                </div>
                <span className="font-bold">{districtOverview.infrastructureIssues}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/monitoring">
                <BarChart3 className="h-6 w-6" />
                <span>View All Schools</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/funds">
                <Wallet className="h-6 w-6" />
                <span>Manage Funds</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/infrastructure/track">
                <Building2 className="h-6 w-6" />
                <span>Review Issues</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/settings">
                <FileText className="h-6 w-6" />
                <span>Manage Data</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
