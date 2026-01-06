"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  School, 
  Users, 
  GraduationCap, 
  BookOpen,
  Trash2,
  Save,
  Loader2,
  Pencil,
  AlertTriangle,
  WifiOff,
  Database,
  CheckCircle
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { getDemoData, DemoDataStore } from "@/lib/demo-data"

type School = {
  id: string
  name: string
  code: string
  district: string
  address: string | null
  created_at: string | null
  updated_at: string | null
}

type Teacher = {
  id: string
  name: string
  email: string | null
  phone: string | null
  subject: string | null
  school_id: string | null
  employee_id: string | null
  password: string | null
  role: string | null
  created_at: string | null
  updated_at: string | null
  schools?: School
}

type Class = {
  id: string
  name: string
  grade: number | null
  section: string | null
  school_id: string | null
  created_at: string | null
}

type Student = {
  id: string
  name: string
  roll_no: string | null  // Database column name
  password: string | null
  class_id: string | null
  school_id: string | null
  parent_phone: string | null
  created_at: string | null
  updated_at: string | null
}

export default function SettingsPage() {
  const supabase = createClient()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("schools")
  
  // Data states
  const [schools, setSchools] = useState<School[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  
  // Form states
  const [schoolForm, setSchoolForm] = useState({ name: "", code: "", district: "", address: "" })
  const [teacherForm, setTeacherForm] = useState({ name: "", email: "", phone: "", subject: "", school_id: "", employee_id: "", password: "", role: "teacher" })
  const [classForm, setClassForm] = useState({ name: "", section: "", grade: "", school_id: "" })
  const [studentForm, setStudentForm] = useState({ name: "", roll_number: "", password: "", parent_phone: "", school_id: "", class_id: "" })

  // Edit states
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [editTeacherForm, setEditTeacherForm] = useState({ name: "", email: "", phone: "", subject: "", school_id: "", employee_id: "", password: "", role: "teacher" })
  const [setupLoading, setSetupLoading] = useState(false)

  // Demo data for offline mode
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  // Load all data
  useEffect(() => {
    loadData()
  }, [])

  const loadDemoData = () => {
    const demoStore = getDemoData()
    setSchools(demoStore.schools as any)
    setTeachers(demoStore.teachers as any)
    setClasses(demoStore.classes as any)
    setStudents(demoStore.students as any)
    setIsOfflineMode(true)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [schoolsRes, teachersRes, classesRes, studentsRes] = await Promise.all([
        supabase.from('schools').select('*').order('created_at', { ascending: false }),
        supabase.from('teachers').select('*').order('created_at', { ascending: false }),
        supabase.from('classes').select('*').order('created_at', { ascending: false }),
        supabase.from('students').select('*').order('created_at', { ascending: false }),
      ])
      
      // Check if we got data or errors
      if (schoolsRes.error || teachersRes.error) {
        console.warn('Supabase not available, using demo mode')
        loadDemoData()
      } else {
        setIsOfflineMode(false)
        if (schoolsRes.data) setSchools(schoolsRes.data)
        if (teachersRes.data) setTeachers(teachersRes.data)
        if (classesRes.data) setClasses(classesRes.data)
        if (studentsRes.data) setStudents(studentsRes.data)
      }
    } catch (err) {
      console.warn('Could not load data, using demo mode:', err)
      loadDemoData()
    }
    setLoading(false)
  }

  // Quick Setup - Add Demo Data
  const setupDemoData = async () => {
    setSetupLoading(true)
    try {
      // 1. Add Demo School
      const { data: schoolData, error: schoolError } = await supabase.from('schools').insert({
        name: 'Government High School',
        code: 'GHS-001',
        district: 'Bangalore Urban',
        address: '123 Education Street, Bangalore - 560001',
      }).select().single()

      if (schoolError || !schoolData) {
        const errorMsg = schoolError?.message || (schoolError as any)?.name || 'Connection failed'
        console.error('Error creating school:', errorMsg)
        
        if (errorMsg.includes('fetch') || errorMsg.includes('network') || errorMsg.includes('Failed to fetch')) {
          alert(`⚠️ Cannot connect to Supabase!\n\nPossible causes:\n1. Your Supabase project may be paused (free tier)\n2. Network connectivity issues\n3. Database tables not created\n\nPlease:\n1. Go to supabase.com/dashboard\n2. Check if your project is active\n3. Run the SQL from supabase/migrations/001_create_erp_schema.sql\n\nYou can still use demo credentials to login without database.`)
        } else {
          alert(`Failed to create school: ${errorMsg}\n\nPlease run the schema migration in Supabase SQL Editor first.`)
        }
        setSetupLoading(false)
        return
      }

      const schoolId = schoolData.id

      // 2. Add Classes (1st to 10th)
      const classesData = [
        { name: 'Class 1-A', grade: 1, section: 'A', school_id: schoolId },
        { name: 'Class 2-A', grade: 2, section: 'A', school_id: schoolId },
        { name: 'Class 3-A', grade: 3, section: 'A', school_id: schoolId },
        { name: 'Class 4-A', grade: 4, section: 'A', school_id: schoolId },
        { name: 'Class 5-A', grade: 5, section: 'A', school_id: schoolId },
        { name: 'Class 6-A', grade: 6, section: 'A', school_id: schoolId },
        { name: 'Class 7-A', grade: 7, section: 'A', school_id: schoolId },
        { name: 'Class 8-A', grade: 8, section: 'A', school_id: schoolId },
        { name: 'Class 9-A', grade: 9, section: 'A', school_id: schoolId },
        { name: 'Class 10-A', grade: 10, section: 'A', school_id: schoolId },
      ]
      
      const { data: insertedClasses } = await supabase.from('classes').insert(classesData).select()
      
      // 3. Add Teachers and Headmaster
      const teachersData = [
        { name: 'Rajesh Kumar', employee_id: 'HM001', password: 'headmaster123', role: 'headmaster', email: 'rajesh@school.gov.in', phone: '9876543210', subject: 'Administration', school_id: schoolId },
        { name: 'Priya Sharma', employee_id: 'TCH001', password: 'teacher123', role: 'teacher', email: 'priya@school.gov.in', phone: '9876543211', subject: 'Mathematics', school_id: schoolId },
        { name: 'Arun Verma', employee_id: 'TCH002', password: 'teacher123', role: 'teacher', email: 'arun@school.gov.in', phone: '9876543212', subject: 'Science', school_id: schoolId },
        { name: 'Lakshmi Devi', employee_id: 'TCH003', password: 'teacher123', role: 'teacher', email: 'lakshmi@school.gov.in', phone: '9876543213', subject: 'English', school_id: schoolId },
        { name: 'Mohammed Ali', employee_id: 'TCH004', password: 'teacher123', role: 'teacher', email: 'ali@school.gov.in', phone: '9876543214', subject: 'Social Studies', school_id: schoolId },
        { name: 'Sunita Rao', employee_id: 'TCH005', password: 'teacher123', role: 'teacher', email: 'sunita@school.gov.in', phone: '9876543215', subject: 'Hindi', school_id: schoolId },
      ]
      
      await supabase.from('teachers').insert(teachersData)

      // 4. Add Students to various classes
      const class10 = insertedClasses?.find(c => c.grade === 10)
      const class9 = insertedClasses?.find(c => c.grade === 9)
      const class8 = insertedClasses?.find(c => c.grade === 8)

      const studentsData = [
        // Class 10 students
        { name: 'Amit Patel', roll_no: 'STU1001', password: 'student123', class_id: class10?.id, school_id: schoolId, parent_phone: '9812345001' },
        { name: 'Sneha Gupta', roll_no: 'STU1002', password: 'student123', class_id: class10?.id, school_id: schoolId, parent_phone: '9812345002' },
        { name: 'Rahul Singh', roll_no: 'STU1003', password: 'student123', class_id: class10?.id, school_id: schoolId, parent_phone: '9812345003' },
        { name: 'Ananya Reddy', roll_no: 'STU1004', password: 'student123', class_id: class10?.id, school_id: schoolId, parent_phone: '9812345004' },
        { name: 'Vikram Joshi', roll_no: 'STU1005', password: 'student123', class_id: class10?.id, school_id: schoolId, parent_phone: '9812345005' },
        // Class 9 students
        { name: 'Meera Nair', roll_no: 'STU0901', password: 'student123', class_id: class9?.id, school_id: schoolId, parent_phone: '9812345006' },
        { name: 'Arjun Menon', roll_no: 'STU0902', password: 'student123', class_id: class9?.id, school_id: schoolId, parent_phone: '9812345007' },
        { name: 'Kavya Sharma', roll_no: 'STU0903', password: 'student123', class_id: class9?.id, school_id: schoolId, parent_phone: '9812345008' },
        { name: 'Sanjay Kumar', roll_no: 'STU0904', password: 'student123', class_id: class9?.id, school_id: schoolId, parent_phone: '9812345009' },
        { name: 'Divya Pillai', roll_no: 'STU0905', password: 'student123', class_id: class9?.id, school_id: schoolId, parent_phone: '9812345010' },
        // Class 8 students
        { name: 'Rohan Das', roll_no: 'STU0801', password: 'student123', class_id: class8?.id, school_id: schoolId, parent_phone: '9812345011' },
        { name: 'Priyanka Iyer', roll_no: 'STU0802', password: 'student123', class_id: class8?.id, school_id: schoolId, parent_phone: '9812345012' },
        { name: 'Karthik Rajan', roll_no: 'STU0803', password: 'student123', class_id: class8?.id, school_id: schoolId, parent_phone: '9812345013' },
        { name: 'Anjali Bose', roll_no: 'STU0804', password: 'student123', class_id: class8?.id, school_id: schoolId, parent_phone: '9812345014' },
        { name: 'Vivek Saxena', roll_no: 'STU0805', password: 'student123', class_id: class8?.id, school_id: schoolId, parent_phone: '9812345015' },
      ]

      await supabase.from('students').insert(studentsData)

      // Reload data
      await loadData()
    } catch (err) {
      console.error('Error setting up demo data:', err)
    }
    setSetupLoading(false)
  }

  // Add School
  const addSchool = async () => {
    if (!schoolForm.name || !schoolForm.code || !schoolForm.district) return
    setLoading(true)
    const { error } = await supabase.from('schools').insert({
      name: schoolForm.name,
      code: schoolForm.code,
      district: schoolForm.district,
      address: schoolForm.address,
    })
    if (!error) {
      setSchoolForm({ name: "", code: "", district: "", address: "" })
      loadData()
    }
    setLoading(false)
  }

  // Add Teacher
  const addTeacher = async () => {
    if (!teacherForm.name || !teacherForm.school_id || !teacherForm.employee_id || !teacherForm.password) return
    setLoading(true)
    
    if (isOfflineMode) {
      // Add to demo data store
      const demoStore = DemoDataStore.getInstance()
      const newTeacher = {
        id: `teacher-${Date.now()}`,
        name: teacherForm.name,
        email: teacherForm.email || null,
        phone: teacherForm.phone || null,
        subject: teacherForm.subject || null,
        school_id: teacherForm.school_id,
        employee_id: teacherForm.employee_id,
        password: teacherForm.password,
        role: teacherForm.role || 'teacher',
      }
      demoStore.addTeacher(newTeacher)
      setTeacherForm({ name: "", email: "", phone: "", subject: "", school_id: "", employee_id: "", password: "", role: "teacher" })
      loadData()
    } else {
      const { error } = await supabase.from('teachers').insert({
        name: teacherForm.name,
        email: teacherForm.email || null,
        phone: teacherForm.phone || null,
        subject: teacherForm.subject || null,
        school_id: teacherForm.school_id,
        employee_id: teacherForm.employee_id,
        password: teacherForm.password,
        role: teacherForm.role || 'teacher',
      })
      if (!error) {
        setTeacherForm({ name: "", email: "", phone: "", subject: "", school_id: "", employee_id: "", password: "", role: "teacher" })
        loadData()
      }
    }
    setLoading(false)
  }

  // Add Class
  const addClass = async () => {
    if (!classForm.name || !classForm.school_id) return
    setLoading(true)
    
    if (isOfflineMode) {
      const demoStore = DemoDataStore.getInstance()
      const newClass = {
        id: `class-${Date.now()}`,
        name: classForm.name,
        section: classForm.section || null,
        grade: classForm.grade ? parseInt(classForm.grade) : null,
        school_id: classForm.school_id,
      }
      demoStore.addClass(newClass)
      setClassForm({ name: "", section: "", grade: "", school_id: "" })
      loadData()
    } else {
      const { error } = await supabase.from('classes').insert({
        name: classForm.name,
        section: classForm.section || null,
        grade: classForm.grade ? parseInt(classForm.grade) : null,
        school_id: classForm.school_id,
      })
      if (!error) {
        setClassForm({ name: "", section: "", grade: "", school_id: "" })
        loadData()
      }
    }
    setLoading(false)
  }

  // Add Student
  const addStudent = async () => {
    if (!studentForm.name || !studentForm.school_id || !studentForm.roll_number || !studentForm.password) return
    setLoading(true)
    
    if (isOfflineMode) {
      const demoStore = DemoDataStore.getInstance()
      const newStudent = {
        id: `student-${Date.now()}`,
        name: studentForm.name,
        roll_no: studentForm.roll_number,
        password: studentForm.password,
        parent_phone: studentForm.parent_phone || null,
        school_id: studentForm.school_id,
        class_id: studentForm.class_id || null,
      }
      demoStore.addStudent(newStudent)
      setStudentForm({ name: "", roll_number: "", password: "", parent_phone: "", school_id: "", class_id: "" })
      loadData()
    } else {
      const { error } = await supabase.from('students').insert({
        name: studentForm.name,
        roll_no: studentForm.roll_number,  // Database column is roll_no
        password: studentForm.password,
        parent_phone: studentForm.parent_phone || null,
        school_id: studentForm.school_id,
        class_id: studentForm.class_id || null,
      })
      if (!error) {
        setStudentForm({ name: "", roll_number: "", password: "", parent_phone: "", school_id: "", class_id: "" })
        loadData()
      } else {
        console.error('Error adding student:', error)
      }
    }
    setLoading(false)
  }

  // Delete functions
  const deleteSchool = async (id: string) => {
    setLoading(true)
    if (isOfflineMode) {
      const demoStore = DemoDataStore.getInstance()
      demoStore.deleteSchool(id)
      loadData()
    } else {
      await supabase.from('schools').delete().eq('id', id)
      loadData()
    }
  }

  const deleteTeacher = async (id: string) => {
    setLoading(true)
    if (isOfflineMode) {
      const demoStore = DemoDataStore.getInstance()
      demoStore.deleteTeacher(id)
      loadData()
    } else {
      await supabase.from('teachers').delete().eq('id', id)
      loadData()
    }
  }

  // Edit Teacher
  const openEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setEditTeacherForm({
      name: teacher.name,
      email: teacher.email || "",
      phone: teacher.phone || "",
      subject: teacher.subject || "",
      school_id: teacher.school_id || "",
      employee_id: teacher.employee_id || "",
      password: "",
      role: teacher.role || "teacher",
    })
  }

  const updateTeacher = async () => {
    if (!editingTeacher || !editTeacherForm.name || !editTeacherForm.school_id) return
    setLoading(true)
    
    if (isOfflineMode) {
      const demoStore = DemoDataStore.getInstance()
      const updateData: any = {
        id: editingTeacher.id,
        name: editTeacherForm.name,
        email: editTeacherForm.email || null,
        phone: editTeacherForm.phone || null,
        subject: editTeacherForm.subject || null,
        school_id: editTeacherForm.school_id,
        employee_id: editTeacherForm.employee_id || null,
        role: editTeacherForm.role || 'teacher',
        password: editTeacherForm.password || editingTeacher.password,
      }
      demoStore.updateTeacher(editingTeacher.id, updateData)
      setEditingTeacher(null)
      loadData()
    } else {
      const updateData: any = {
        name: editTeacherForm.name,
        email: editTeacherForm.email || null,
        phone: editTeacherForm.phone || null,
        subject: editTeacherForm.subject || null,
        school_id: editTeacherForm.school_id,
        employee_id: editTeacherForm.employee_id || null,
        role: editTeacherForm.role || 'teacher',
      }
      // Only update password if provided
      if (editTeacherForm.password) {
        updateData.password = editTeacherForm.password
      }
      const { error } = await supabase.from('teachers').update(updateData).eq('id', editingTeacher.id)
      
      if (!error) {
        setEditingTeacher(null)
        loadData()
      }
    }
    setLoading(false)
  }

  const deleteClass = async (id: string) => {
    setLoading(true)
    if (isOfflineMode) {
      const demoStore = DemoDataStore.getInstance()
      demoStore.deleteClass(id)
      loadData()
    } else {
      await supabase.from('classes').delete().eq('id', id)
      loadData()
    }
  }

  const deleteStudent = async (id: string) => {
    setLoading(true)
    if (isOfflineMode) {
      const demoStore = DemoDataStore.getInstance()
      demoStore.deleteStudent(id)
      loadData()
    } else {
      await supabase.from('students').delete().eq('id', id)
      loadData()
    }
  }

  return (
    <div className="space-y-6">
      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <Card className="border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-600">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Demo Mode Active</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Supabase is not connected. Showing demo data. To enable full functionality, restore your Supabase project at supabase.com/dashboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('settingsPage.title')}</h1>
        <p className="text-muted-foreground text-lg">
          {t('settingsPage.description')}
        </p>
      </div>

      {/* Quick Setup Card - Only show if no data exists and online */}
      {schools.length === 0 && !isOfflineMode && (
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              Quick Setup - Add Demo Data
            </CardTitle>
            <CardDescription className="text-base">
              Get started quickly by adding sample schools, teachers, classes, and students with login credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-card rounded-lg p-4 mb-4 border">
              <h4 className="font-semibold mb-2">This will create:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ 1 Government High School</li>
                <li>✓ 10 Classes (Class 1 to 10)</li>
                <li>✓ 1 Headmaster (ID: <code className="bg-muted px-1 rounded">HM001</code> / Password: <code className="bg-muted px-1 rounded">headmaster123</code>)</li>
                <li>✓ 5 Teachers (ID: <code className="bg-muted px-1 rounded">TCH001</code>-<code className="bg-muted px-1 rounded">TCH005</code> / Password: <code className="bg-muted px-1 rounded">teacher123</code>)</li>
                <li>✓ 15 Students with login credentials (Password: <code className="bg-muted px-1 rounded">student123</code>)</li>
              </ul>
            </div>
            <Button onClick={setupDemoData} disabled={setupLoading} className="bg-gradient-to-r from-primary to-primary/80">
              {setupLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Setup Demo Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Login Credentials Reference Card */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Login Credentials Summary</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-400">🎓 Students</p>
                  <p className="text-blue-600 dark:text-blue-300">Roll Number + Password</p>
                </div>
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-400">👨‍🏫 Teachers</p>
                  <p className="text-blue-600 dark:text-blue-300">Employee ID + Password</p>
                </div>
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-400">🏫 Headmaster</p>
                  <p className="text-blue-600 dark:text-blue-300">Employee ID + Password</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schools" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            {t('settingsPage.schools')}
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {t('settingsPage.teachers')}
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {t('settingsPage.classes')}
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('settingsPage.students')}
          </TabsTrigger>
        </TabsList>

        {/* Schools Tab */}
        <TabsContent value="schools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New School
              </CardTitle>
              <CardDescription>Enter school details to add to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="school-name">School Name *</Label>
                  <Input
                    id="school-name"
                    placeholder="e.g., Govt. High School"
                    value={schoolForm.name}
                    onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school-code">School Code *</Label>
                  <Input
                    id="school-code"
                    placeholder="e.g., GHS-35"
                    value={schoolForm.code}
                    onChange={(e) => setSchoolForm({ ...schoolForm, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    placeholder="e.g., Chandigarh"
                    value={schoolForm.district}
                    onChange={(e) => setSchoolForm({ ...schoolForm, district: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Full address"
                    value={schoolForm.address}
                    onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={addSchool} className="mt-4" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Add School
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registered Schools ({schools.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {schools.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No schools added yet. Add your first school above.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>{school.code}</TableCell>
                        <TableCell>{school.district}</TableCell>
                        <TableCell>{school.address || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => deleteSchool(school.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Register New Teacher / Headmaster
              </CardTitle>
              <CardDescription>Enter details to register a new user to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-name">Full Name *</Label>
                  <Input
                    id="teacher-name"
                    placeholder="Full name"
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-employee-id">Employee ID *</Label>
                  <Input
                    id="teacher-employee-id"
                    placeholder="e.g., TCH001"
                    value={teacherForm.employee_id}
                    onChange={(e) => setTeacherForm({ ...teacherForm, employee_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-password">Password *</Label>
                  <Input
                    id="teacher-password"
                    type="password"
                    placeholder="Enter password"
                    value={teacherForm.password}
                    onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-role">Role *</Label>
                  <Select value={teacherForm.role} onValueChange={(value) => setTeacherForm({ ...teacherForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="headmaster">Headmaster</SelectItem>
                      <SelectItem value="official">Government Official</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-school">School *</Label>
                  <Select value={teacherForm.school_id} onValueChange={(value) => setTeacherForm({ ...teacherForm, school_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-email">Email</Label>
                  <Input
                    id="teacher-email"
                    type="email"
                    placeholder="Email address"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-phone">Phone</Label>
                  <Input
                    id="teacher-phone"
                    placeholder="Phone number"
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-subject">Subject</Label>
                  <Input
                    id="teacher-subject"
                    placeholder="e.g., Mathematics"
                    value={teacherForm.subject}
                    onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={addTeacher} className="mt-4" disabled={loading || schools.length === 0}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Register User
              </Button>
              {schools.length === 0 && (
                <p className="text-sm text-orange-600 mt-2">Please add a school first before registering users.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registered Users ({teachers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {teachers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No users registered yet. Register your first user above.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.employee_id || "-"}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            teacher.role === 'headmaster' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                            teacher.role === 'official' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          }`}>
                            {teacher.role || 'teacher'}
                          </span>
                        </TableCell>
                        <TableCell>{schools.find(s => s.id === teacher.school_id)?.name || "-"}</TableCell>
                        <TableCell>{teacher.email || "-"}</TableCell>
                        <TableCell>{teacher.subject || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => openEditTeacher(teacher)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteTeacher(teacher.id)}>
                              <Trash2 className="h-4 w-4" />
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

          {/* Edit Teacher Dialog */}
          <Dialog open={!!editingTeacher} onOpenChange={(open) => !open && setEditingTeacher(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update user information below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-teacher-name">Full Name *</Label>
                    <Input
                      id="edit-teacher-name"
                      placeholder="Full name"
                      value={editTeacherForm.name}
                      onChange={(e) => setEditTeacherForm({ ...editTeacherForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-teacher-employee-id">Employee ID</Label>
                    <Input
                      id="edit-teacher-employee-id"
                      placeholder="e.g., TCH001"
                      value={editTeacherForm.employee_id}
                      onChange={(e) => setEditTeacherForm({ ...editTeacherForm, employee_id: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-teacher-password">New Password</Label>
                    <Input
                      id="edit-teacher-password"
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={editTeacherForm.password}
                      onChange={(e) => setEditTeacherForm({ ...editTeacherForm, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-teacher-role">Role *</Label>
                    <Select value={editTeacherForm.role} onValueChange={(value) => setEditTeacherForm({ ...editTeacherForm, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="headmaster">Headmaster</SelectItem>
                        <SelectItem value="official">Government Official</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-teacher-school">School *</Label>
                  <Select value={editTeacherForm.school_id} onValueChange={(value) => setEditTeacherForm({ ...editTeacherForm, school_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-teacher-email">Email</Label>
                    <Input
                      id="edit-teacher-email"
                      type="email"
                      placeholder="Email address"
                      value={editTeacherForm.email}
                      onChange={(e) => setEditTeacherForm({ ...editTeacherForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-teacher-phone">Phone</Label>
                    <Input
                      id="edit-teacher-phone"
                      placeholder="Phone number"
                      value={editTeacherForm.phone}
                      onChange={(e) => setEditTeacherForm({ ...editTeacherForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-teacher-subject">Subject</Label>
                  <Input
                    id="edit-teacher-subject"
                    placeholder="e.g., Mathematics"
                    value={editTeacherForm.subject}
                    onChange={(e) => setEditTeacherForm({ ...editTeacherForm, subject: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingTeacher(null)}>
                  Cancel
                </Button>
                <Button onClick={updateTeacher} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Class
              </CardTitle>
              <CardDescription>Enter class details to add to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="class-name">Class Name *</Label>
                  <Input
                    id="class-name"
                    placeholder="e.g., Class 8B"
                    value={classForm.name}
                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class-school">School *</Label>
                  <Select value={classForm.school_id} onValueChange={(value) => setClassForm({ ...classForm, school_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class-section">Section</Label>
                  <Input
                    id="class-section"
                    placeholder="e.g., A, B, C"
                    value={classForm.section}
                    onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class-grade">Grade</Label>
                  <Input
                    id="class-grade"
                    type="number"
                    placeholder="e.g., 8"
                    value={classForm.grade}
                    onChange={(e) => setClassForm({ ...classForm, grade: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={addClass} className="mt-4" disabled={loading || schools.length === 0}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Add Class
              </Button>
              {schools.length === 0 && (
                <p className="text-sm text-orange-600 mt-2">Please add a school first before adding classes.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registered Classes ({classes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {classes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No classes added yet. Add your first class above.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">{cls.name}</TableCell>
                        <TableCell>{schools.find(s => s.id === cls.school_id)?.name || "-"}</TableCell>
                        <TableCell>{cls.section || "-"}</TableCell>
                        <TableCell>{cls.grade || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => deleteClass(cls.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-300">Student Login Credentials</h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    When you add a student, create their <strong>Roll Number</strong> and <strong>Password</strong>. 
                    Students use these credentials to log into the portal and view their attendance & resources.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Register New Student
              </CardTitle>
              <CardDescription>Enter student details and create their login credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Student Name *</Label>
                  <Input
                    id="student-name"
                    placeholder="Full name"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-roll-number">Roll Number (Login ID) *</Label>
                  <Input
                    id="student-roll-number"
                    placeholder="e.g., STU001"
                    value={studentForm.roll_number}
                    onChange={(e) => setStudentForm({ ...studentForm, roll_number: e.target.value.toUpperCase() })}
                  />
                  <p className="text-xs text-muted-foreground">This will be used to login</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password *</Label>
                  <Input
                    id="student-password"
                    type="password"
                    placeholder="Create password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Student will use this to login</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-school">School *</Label>
                  <Select value={studentForm.school_id} onValueChange={(value) => setStudentForm({ ...studentForm, school_id: value, class_id: "" })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-class">Class</Label>
                  <Select value={studentForm.class_id} onValueChange={(value) => setStudentForm({ ...studentForm, class_id: value })} disabled={!studentForm.school_id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.filter(c => c.school_id === studentForm.school_id).map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-phone">Parent Phone</Label>
                  <Input
                    id="student-phone"
                    placeholder="Phone number"
                    value={studentForm.parent_phone}
                    onChange={(e) => setStudentForm({ ...studentForm, parent_phone: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={addStudent} className="mt-4" disabled={loading || schools.length === 0 || !studentForm.name || !studentForm.roll_number || !studentForm.password}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Register Student
              </Button>
              {schools.length === 0 && (
                <p className="text-sm text-orange-600 mt-2">Please add a school first before adding students.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registered Students ({students.length})</CardTitle>
              <CardDescription>Students can login using their Roll Number and Password</CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No students added yet. Register your first student above.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll Number (Login)</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Parent Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm font-mono">
                            {student.roll_no || "-"}
                          </code>
                        </TableCell>
                        <TableCell>{schools.find(s => s.id === student.school_id)?.name || "-"}</TableCell>
                        <TableCell>{classes.find(c => c.id === student.class_id)?.name || "-"}</TableCell>
                        <TableCell>{student.parent_phone || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => deleteStudent(student.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
