"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BookOpen,
  FileText,
  Video,
  ExternalLink,
  Building2,
  AlertTriangle
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"

interface AttendanceRecord {
  date: string
  status: string
}

export default function StudentDashboard() {
  const supabase = createClient()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [studentName, setStudentName] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [attendanceStats, setAttendanceStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    
    const studentId = localStorage.getItem('studentId')
    const student = localStorage.getItem('userName')
    const roll = localStorage.getItem('rollNumber')
    const school = localStorage.getItem('schoolName')
    
    setStudentName(student || '')
    setRollNumber(roll || '')
    setSchoolName(school || '')

    if (!studentId) {
      setLoading(false)
      return
    }

    // Generate demo data for demo student
    if (studentId === 'demo-student-001') {
      const demoRecords = []
      const today = new Date()
      
      // Generate 30 days of demo attendance
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        // Generate realistic pattern
        let status = 'present'
        if (i % 7 === 0 || i % 7 === 6) {
          status = 'absent' // Weekend
        } else if (i % 15 === 0) {
          status = 'late'
        } else if (i % 10 === 0) {
          status = 'absent'
        }
        
        demoRecords.push({
          id: `demo-${i}`,
          student_id: 'demo-student-001',
          date: date.toISOString().split('T')[0],
          status: status,
          school_id: 'demo-school-001'
        })
      }
      
      setAttendanceData(demoRecords as any)
      const present = demoRecords.filter(r => r.status === 'present').length
      const absent = demoRecords.filter(r => r.status === 'absent').length
      const late = demoRecords.filter(r => r.status === 'late').length
      const total = demoRecords.length
      
      setAttendanceStats({
        totalDays: total,
        present,
        absent,
        late,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0
      })
      
      setLoading(false)
      return
    }

    // Fetch attendance data from database for real students
    const { data: attendance } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
      .limit(30)

    if (attendance) {
      setAttendanceData(attendance)
      const present = attendance.filter(a => a.status === 'present').length
      const absent = attendance.filter(a => a.status === 'absent').length
      const late = attendance.filter(a => a.status === 'late').length
      const total = attendance.length
      
      setAttendanceStats({
        totalDays: total,
        present,
        absent,
        late,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0
      })
    }

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          {t('student.dashboard')}
        </h1>
        <p className="text-muted-foreground text-lg">{t('student.viewAttendance')}</p>
      </div>

      {/* Student Info */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            {t('student.information')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('common.name')}</p>
              <p className="text-xl font-bold">{studentName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('common.rollNo')}</p>
              <p className="text-xl font-bold text-primary">{rollNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('common.school')}</p>
              <p className="text-xl font-bold">{schoolName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          {t('student.myAttendance')}
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="stats-card transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-emerald-50 to-green-100/50 dark:from-emerald-950/30 dark:to-green-900/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('student.attendanceRate')}
              </CardTitle>
              <div className="icon-badge bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 dark:text-green-400">{attendanceStats.percentage}%</div>
              <Progress value={attendanceStats.percentage} className="mt-3 h-2 progress-animated" />
              <p className="text-xs text-muted-foreground mt-2">
                {attendanceStats.present} / {attendanceStats.totalDays} {t('common.days')}
              </p>
            </CardContent>
          </Card>

          <Card className="stats-card transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('student.presentDays')}
              </CardTitle>
              <div className="icon-badge bg-blue-500/10">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{attendanceStats.present}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('student.last30Days')}</p>
            </CardContent>
          </Card>

          <Card className="stats-card transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-red-50 to-rose-100/50 dark:from-red-950/30 dark:to-rose-900/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('student.absentDays')}
              </CardTitle>
              <div className="icon-badge bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700 dark:text-red-400">{attendanceStats.absent}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('student.last30Days')}</p>
            </CardContent>
          </Card>

          <Card className="stats-card transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-amber-50 to-yellow-100/50 dark:from-amber-950/30 dark:to-yellow-900/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('student.lateArrivals')}
              </CardTitle>
              <div className="icon-badge bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">{attendanceStats.late}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('student.last30Days')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance History */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            {t('student.attendanceHistory')}
          </CardTitle>
          <CardDescription>{t('student.last30Days')}</CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceData.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {t('student.noAttendanceData')}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {attendanceData.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border hover:bg-accent/30 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium">
                      {new Date(record.date).toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <Badge 
                    className={`px-3 py-1 text-xs font-semibold ${
                      record.status === 'present' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : record.status === 'late' 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {record.status === 'present' ? t('student.present') : 
                     record.status === 'late' ? t('student.late') : 
                     t('student.absent')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Resources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            {t('student.learningResources')}
          </h2>
          <Button variant="outline" className="group" asChild>
            <Link href="/dashboard/student/resources">
              {t('student.viewAllResources')}
              <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="quick-action-card p-0 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{t('student.studyMaterials')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('student.studyMaterialsDesc')}
                  </p>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" asChild>
                    <Link href="/dashboard/student/resources">
                      {t('student.browseMaterials')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="quick-action-card p-0 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <Video className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{t('student.videoLessons')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('student.videoLessonsDesc')}
                  </p>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" asChild>
                    <Link href="/dashboard/student/resources">
                      {t('student.watchVideos')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="quick-action-card p-0 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{t('student.practiceTests')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('student.practiceTestsDesc')}
                  </p>
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700" asChild>
                    <Link href="/dashboard/student/resources">
                      {t('student.startPractice')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Infrastructure Reports Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-amber-600" />
            </div>
            {t('student.schoolInfrastructure')}
          </h2>
          <Button variant="outline" className="group" asChild>
            <Link href="/dashboard/student/infrastructure">
              {t('student.viewInfrastructureReports')}
              <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 dark:border-amber-800 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  {t('student.infrastructureReports')}
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('student.infrastructureDesc')}
                </p>
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md" asChild>
                  <Link href="/dashboard/student/infrastructure">
                    {t('student.viewInfrastructureReports')}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
