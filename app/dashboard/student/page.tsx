"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
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
  Download,
  ExternalLink
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface AttendanceRecord {
  date: string
  status: string
}

export default function StudentDashboard() {
  const t = useTranslations()
  const supabase = createClient()
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

    // Fetch attendance data
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('student.dashboard')}</h1>
        <p className="text-muted-foreground">{t('student.viewAttendance')}</p>
      </div>

      {/* Student Info */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('student.information')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">{t('common.name')}</p>
              <p className="text-lg font-semibold">{studentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('common.rollNo')}</p>
              <p className="text-lg font-semibold">{rollNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('common.school')}</p>
              <p className="text-lg font-semibold">{schoolName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('student.myAttendance')}</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('student.attendanceRate')}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.percentage}%</div>
              <Progress value={attendanceStats.percentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {attendanceStats.present} / {attendanceStats.totalDays} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('student.presentDays')}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
              <p className="text-xs text-muted-foreground">{t('student.last30Days')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('student.absentDays')}
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('student.lateArrivals')}
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('student.attendanceHistory')}
          </CardTitle>
          <CardDescription>{t('student.last30Days')}</CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t('student.noAttendanceData')}
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {attendanceData.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
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
                    variant={
                      record.status === 'present' ? 'default' : 
                      record.status === 'late' ? 'secondary' : 
                      'destructive'
                    }
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
          <h2 className="text-xl font-semibold">{t('student.learningResources')}</h2>
          <Button variant="outline" asChild>
            <Link href="/dashboard/student/resources">
              {t('student.viewAllResources')}
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('student.studyMaterials')}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('student.studyMaterialsDesc')}
                  </p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/dashboard/student/resources">
                      {t('student.browseMaterials')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <Video className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('student.videoLessons')}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('student.videoLessonsDesc')}
                  </p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/dashboard/student/resources">
                      {t('student.watchVideos')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('student.practiceTests')}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('student.practiceTestsDesc')}
                  </p>
                  <Button size="sm" variant="outline" asChild>
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
    </div>
  )
}
