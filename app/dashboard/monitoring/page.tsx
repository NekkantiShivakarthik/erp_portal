"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp, 
  TrendingDown,
  School,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  MapPin,
  Eye,
  Loader2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function MonitoringPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [schools, setSchools] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [districtStats, setDistrictStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    avgAttendance: 0,
    infrastructureIssues: 0,
    resolvedIssues: 0,
    fundsAllocated: 0,
    fundsUtilized: 0,
    utilizationRate: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)

    // Get all schools with counts
    const { data: schoolsData } = await supabase.from('schools').select('*')
    
    // Get student counts per school
    const { data: studentsData } = await supabase.from('students').select('school_id')
    const { data: teachersData } = await supabase.from('teachers').select('school_id')
    const { data: issuesData } = await supabase.from('infrastructure_issues').select('school_id, status')
    const { data: fundsData } = await supabase.from('funds').select('school_id, allocated_amount, utilized_amount')
    const { data: alertsData } = await supabase.from('alerts').select('*, schools(name)').eq('is_resolved', false).limit(5)

    // Calculate attendance for today
    const today = new Date().toISOString().split('T')[0]
    const { data: attendanceData } = await supabase.from('attendance').select('student_id, status, students(school_id)').eq('date', today)

    // Aggregate school data
    const schoolsWithStats = (schoolsData || []).map(school => {
      const studentCount = studentsData?.filter(s => s.school_id === school.id).length || 0
      const teacherCount = teachersData?.filter(t => t.school_id === school.id).length || 0
      const pendingIssues = issuesData?.filter(i => i.school_id === school.id && i.status !== 'resolved').length || 0
      
      const schoolFunds = fundsData?.filter(f => f.school_id === school.id) || []
      const allocated = schoolFunds.reduce((sum, f) => sum + (f.allocated_amount || 0), 0)
      const utilized = schoolFunds.reduce((sum, f) => sum + (f.utilized_amount || 0), 0)
      
      const schoolAttendance = attendanceData?.filter(a => (a.students as any)?.school_id === school.id) || []
      const presentCount = schoolAttendance.filter(a => a.status === 'present').length
      const attendance = schoolAttendance.length > 0 ? (presentCount / schoolAttendance.length * 100) : 0

      return {
        ...school,
        students: studentCount,
        teachers: teacherCount,
        pendingIssues,
        fundsUtilized: allocated > 0 ? (utilized / allocated * 100) : 0,
        attendance: attendance,
      }
    })

    // Calculate district totals
    const totalStudents = studentsData?.length || 0
    const totalTeachers = teachersData?.length || 0
    const openIssues = issuesData?.filter(i => i.status !== 'resolved').length || 0
    const resolvedIssues = issuesData?.filter(i => i.status === 'resolved').length || 0
    const totalAllocated = fundsData?.reduce((sum, f) => sum + (f.allocated_amount || 0), 0) || 0
    const totalUtilized = fundsData?.reduce((sum, f) => sum + (f.utilized_amount || 0), 0) || 0
    
    const presentTotal = attendanceData?.filter(a => a.status === 'present').length || 0
    const attendanceTotal = attendanceData?.length || 0
    const avgAttendance = attendanceTotal > 0 ? (presentTotal / attendanceTotal * 100) : 0

    setSchools(schoolsWithStats)
    setAlerts(alertsData || [])
    setDistrictStats({
      totalSchools: schoolsData?.length || 0,
      totalStudents,
      totalTeachers,
      avgAttendance,
      infrastructureIssues: openIssues,
      resolvedIssues,
      fundsAllocated: totalAllocated,
      fundsUtilized: totalUtilized,
      utilizationRate: totalAllocated > 0 ? (totalUtilized / totalAllocated * 100) : 0,
    })
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const hasNoData = districtStats.totalSchools === 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Monitoring & Reporting Panel</h1>
          <p className="text-muted-foreground">
            Overview of all schools under your jurisdiction
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/settings">Manage Data</Link>
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

      {/* District Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Schools
            </CardTitle>
            <School className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{districtStats.totalSchools}</div>
            <p className="text-xs text-muted-foreground">
              {districtStats.totalStudents.toLocaleString()} students enrolled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Attendance
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{districtStats.avgAttendance.toFixed(1)}%</div>
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
            <div className="text-2xl font-bold">{districtStats.infrastructureIssues}</div>
            <p className="text-xs text-muted-foreground">
              {districtStats.resolvedIssues} resolved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fund Utilization
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{districtStats.utilizationRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              ₹{(districtStats.fundsUtilized / 100000).toFixed(1)}L of ₹{(districtStats.fundsAllocated / 100000).toFixed(1)}L
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              Attention Required
            </CardTitle>
            <CardDescription>Issues that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      alert.severity === "critical" 
                        ? "bg-red-500" 
                        : alert.severity === "high"
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{(alert.schools as any)?.name || 'School'}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
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

      {/* Schools Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>School-wise Performance</CardTitle>
              <CardDescription>Detailed view of all schools in the district</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {schools.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No schools registered yet. Add schools in Settings.
            </p>
          ) : (
            <div className="space-y-4">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{school.name}</h3>
                        <Badge variant="outline">{school.code}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {school.district || 'N/A'}
                        </span>
                        <span>{school.students} students</span>
                        <span>{school.teachers} teachers</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-center gap-1">
                          <span className={`font-bold ${
                            school.attendance >= 90 ? "text-green-600" : 
                            school.attendance >= 80 ? "text-orange-600" : "text-red-600"
                          }`}>
                            {school.attendance.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Attendance</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <div className={`font-bold ${
                          school.pendingIssues > 5 ? "text-red-600" : 
                          school.pendingIssues > 2 ? "text-orange-600" : "text-green-600"
                        }`}>
                          {school.pendingIssues}
                        </div>
                        <p className="text-xs text-muted-foreground">Pending Issues</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <div className="font-bold">{school.fundsUtilized.toFixed(0)}%</div>
                        <p className="text-xs text-muted-foreground">Funds Used</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
