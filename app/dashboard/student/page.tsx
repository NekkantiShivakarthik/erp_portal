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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">View your attendance and access learning resources</p>
      </div>

      {/* Student Info */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{studentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Roll Number</p>
              <p className="text-lg font-semibold">{rollNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">School</p>
              <p className="text-lg font-semibold">{schoolName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Attendance</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Attendance Rate
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
                Present Days
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Absent Days
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
                Late Arrivals
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
            Attendance History
          </CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No attendance data available
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
                    {record.status === 'present' ? 'Present' : 
                     record.status === 'late' ? 'Late' : 
                     'Absent'}
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
          <h2 className="text-xl font-semibold">Learning Resources</h2>
          <Button variant="outline" asChild>
            <Link href="/dashboard/student/resources">
              View All Resources
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
                  <h3 className="font-semibold mb-1">Study Materials</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Access textbooks, notes, and study guides
                  </p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/dashboard/student/resources">
                      Browse Materials
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
                  <h3 className="font-semibold mb-1">Video Lessons</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Watch educational videos and tutorials
                  </p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/dashboard/student/resources">
                      Watch Videos
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
                  <h3 className="font-semibold mb-1">Practice Tests</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Take quizzes and practice exams
                  </p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/dashboard/student/resources">
                      Start Practice
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
