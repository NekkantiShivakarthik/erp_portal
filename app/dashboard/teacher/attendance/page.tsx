"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Save,
  Users,
  CalendarDays,
  Loader2,
  AlertCircle,
  AlertTriangle
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { getDemoData } from "@/lib/demo-data"

type Student = {
  id: string
  name: string
  roll_no: string | null
  class_id: string | null
  school_id: string | null
  parent_phone: string | null
  created_at: string | null
  updated_at: string | null
}

type Class = {
  id: string
  name: string
  grade: number | null
  section: string | null
  school_id: string | null
  created_at: string | null
}

export default function AttendancePage() {
  const supabase = createClient()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [selectedClass, setSelectedClass] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [attendance, setAttendance] = useState<Record<string, string>>({})

  // Load classes on mount
  useEffect(() => {
    loadClasses()
  }, [])

  // Load students when class changes
  useEffect(() => {
    if (selectedClass) {
      loadStudents()
    }
  }, [selectedClass, date])

  const loadClasses = async () => {
    try {
      const { data, error } = await supabase.from('classes').select('*').order('name')
      if (error) throw error
      
      if (data && data.length > 0) {
        setClasses(data)
        setSelectedClass(data[0].id)
        setIsOfflineMode(false)
      } else {
        // No data, use demo
        loadDemoClasses()
      }
    } catch (e) {
      // Supabase unavailable, use demo data
      loadDemoClasses()
    }
    setLoading(false)
  }

  const loadDemoClasses = () => {
    setIsOfflineMode(true)
    const demoStore = getDemoData()
    const demoClasses = demoStore.classes.map(c => ({
      id: c.id,
      name: c.name,
      grade: c.grade,
      section: c.section,
      school_id: c.school_id,
      created_at: c.created_at
    }))
    setClasses(demoClasses)
    if (demoClasses.length > 0) {
      setSelectedClass(demoClasses[0].id)
    }
  }

  const loadStudents = async () => {
    setLoading(true)
    
    if (isOfflineMode) {
      // Load from demo data
      const demoStore = getDemoData()
      const demoStudents = demoStore.getStudentsByClass(selectedClass).map(s => ({
        id: s.id,
        name: s.name,
        roll_no: s.roll_no,
        class_id: s.class_id,
        school_id: s.school_id,
        parent_phone: s.parent_phone,
        created_at: s.created_at,
        updated_at: s.updated_at
      }))
      setStudents(demoStudents)
      
      // Load existing attendance from demo
      const dateStr = date?.toISOString().split('T')[0] || ''
      const demoAttendance = demoStore.getAttendanceByDate(dateStr)
      const attendanceMap: Record<string, string> = {}
      demoStudents.forEach(s => {
        const record = demoAttendance.find(a => a.student_id === s.id)
        attendanceMap[s.id] = record?.status || 'present'
      })
      setAttendance(attendanceMap)
      setLoading(false)
      return
    }

    // Load students for the selected class from Supabase
    const { data: studentsData } = await supabase
      .from('students')
      .select('*')
      .eq('class_id', selectedClass)
      .order('roll_no')

    if (studentsData) {
      setStudents(studentsData)
      
      // Load existing attendance for the selected date
      const dateStr = date?.toISOString().split('T')[0]
      if (dateStr) {
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('*')
          .eq('class_id', selectedClass)
          .eq('date', dateStr)

        const attendanceMap: Record<string, string> = {}
        studentsData.forEach(s => {
          const record = attendanceData?.find(a => a.student_id === s.id)
          attendanceMap[s.id] = record?.status || 'present'
        })
        setAttendance(attendanceMap)
      }
    }
    setLoading(false)
  }

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendance({ ...attendance, [studentId]: status })
  }

  const saveAttendance = async () => {
    if (!date || !selectedClass) return
    setSaving(true)
    
    const dateStr = date.toISOString().split('T')[0]
    const teacherId = localStorage.getItem('userId') || 'teacher-01'
    
    if (isOfflineMode) {
      // Save to demo data store
      const demoStore = getDemoData()
      students.forEach(student => {
        demoStore.markAttendance(
          student.id, 
          selectedClass, 
          dateStr, 
          (attendance[student.id] || 'present') as 'present' | 'absent' | 'late',
          teacherId
        )
      })
      setSaving(false)
      alert('Attendance saved successfully! (Demo mode)')
      return
    }
    
    // Delete existing attendance for this class and date
    await supabase
      .from('attendance')
      .delete()
      .eq('class_id', selectedClass)
      .eq('date', dateStr)
    
    // Insert new attendance records
    const records = students.map(student => ({
      student_id: student.id,
      class_id: selectedClass,
      date: dateStr,
      status: attendance[student.id] || 'present'
    }))
    
    await supabase.from('attendance').insert(records)
    setSaving(false)
    alert('Attendance saved successfully!')
  }

  const presentCount = Object.values(attendance).filter(s => s === "present").length
  const absentCount = Object.values(attendance).filter(s => s === "absent").length
  const lateCount = Object.values(attendance).filter(s => s === "late").length

  if (loading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (classes.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('attendancePage.title')}</h1>
          <p className="text-muted-foreground">{t('attendancePage.description')}</p>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('attendancePage.noClasses')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('attendancePage.noClassesDesc')}
              </p>
              <Button asChild>
                <a href="/dashboard/settings">{t('common.settings')}</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <Card className="border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-600">
          <CardContent className="py-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Demo Mode:</strong> Attendance will be saved locally. Connect Supabase for cloud storage.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('attendancePage.title')}</h1>
          <p className="text-muted-foreground">
            {t('attendancePage.description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('attendancePage.exportReport')}
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={saveAttendance} disabled={saving || students.length === 0}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {t('attendancePage.saveAttendance')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="w-48">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder={t('attendancePage.selectClass')} />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} {cls.section ? `- ${cls.section}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green-100 p-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                    <p className="text-sm text-muted-foreground">{t('attendancePage.present')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-red-100 p-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                    <p className="text-sm text-muted-foreground">{t('attendancePage.absent')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-orange-100 p-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{lateCount}</p>
                    <p className="text-sm text-muted-foreground">{t('attendancePage.late')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{classes.find(c => c.id === selectedClass)?.name || 'Select a Class'}</CardTitle>
                  <CardDescription>
                    {date?.toLocaleDateString("en-IN", { 
                      weekday: "long", 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {students.length} Students
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {t('attendancePage.noStudentsDesc')}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('attendancePage.rollNo')}</TableHead>
                      <TableHead>{t('attendancePage.student')}</TableHead>
                      <TableHead className="text-center">{t('attendancePage.status')}</TableHead>
                      <TableHead className="text-center">{t('common.actions') || 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.roll_no || '-'}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              attendance[student.id] === "present"
                                ? "default"
                                : attendance[student.id] === "absent"
                                ? "destructive"
                                : "secondary"
                            }
                            className={
                              attendance[student.id] === "present"
                                ? "bg-green-500"
                                : attendance[student.id] === "late"
                                ? "bg-orange-500"
                                : ""
                            }
                          >
                            {attendance[student.id] || 'present'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button
                              variant={attendance[student.id] === "present" ? "default" : "outline"}
                              size="sm"
                              className={attendance[student.id] === "present" ? "bg-green-500 hover:bg-green-600" : ""}
                              onClick={() => handleAttendanceChange(student.id, "present")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={attendance[student.id] === "absent" ? "destructive" : "outline"}
                              size="sm"
                              onClick={() => handleAttendanceChange(student.id, "absent")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={attendance[student.id] === "late" ? "default" : "outline"}
                              size="sm"
                              className={attendance[student.id] === "late" ? "bg-orange-500 hover:bg-orange-600" : ""}
                              onClick={() => handleAttendanceChange(student.id, "late")}
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calendar Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                {t('attendancePage.selectDate')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('attendancePage.todaysSummary')}</CardTitle>
              <CardDescription>{t('attendancePage.attendanceStatistics')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('attendancePage.present')}</span>
                <span className="font-bold text-green-600">{presentCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('attendancePage.absent')}</span>
                <span className="font-bold text-red-600">{absentCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('attendancePage.late')}</span>
                <span className="font-bold text-orange-600">{lateCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('attendancePage.attendanceRate')}</span>
                <span className="font-bold text-blue-600">
                  {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
