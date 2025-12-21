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
  Pencil
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"

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
  roll_no: string | null
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
  const [studentForm, setStudentForm] = useState({ name: "", roll_no: "", parent_phone: "", school_id: "", class_id: "" })

  // Edit states
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [editTeacherForm, setEditTeacherForm] = useState({ name: "", email: "", phone: "", subject: "", school_id: "", employee_id: "", password: "", role: "teacher" })

  // Load all data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [schoolsRes, teachersRes, classesRes, studentsRes] = await Promise.all([
      supabase.from('schools').select('*').order('created_at', { ascending: false }),
      supabase.from('teachers').select('*').order('created_at', { ascending: false }),
      supabase.from('classes').select('*').order('created_at', { ascending: false }),
      supabase.from('students').select('*').order('created_at', { ascending: false }),
    ])
    
    if (schoolsRes.data) setSchools(schoolsRes.data)
    if (teachersRes.data) setTeachers(teachersRes.data)
    if (classesRes.data) setClasses(classesRes.data)
    if (studentsRes.data) setStudents(studentsRes.data)
    setLoading(false)
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
    setLoading(false)
  }

  // Add Class
  const addClass = async () => {
    if (!classForm.name || !classForm.school_id) return
    setLoading(true)
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
    setLoading(false)
  }

  // Add Student
  const addStudent = async () => {
    if (!studentForm.name || !studentForm.school_id) return
    setLoading(true)
    const { error } = await supabase.from('students').insert({
      name: studentForm.name,
      roll_no: studentForm.roll_no || null,
      parent_phone: studentForm.parent_phone || null,
      school_id: studentForm.school_id,
      class_id: studentForm.class_id || null,
    })
    if (!error) {
      setStudentForm({ name: "", roll_no: "", parent_phone: "", school_id: "", class_id: "" })
      loadData()
    }
    setLoading(false)
  }

  // Delete functions
  const deleteSchool = async (id: string) => {
    setLoading(true)
    await supabase.from('schools').delete().eq('id', id)
    loadData()
  }

  const deleteTeacher = async (id: string) => {
    setLoading(true)
    await supabase.from('teachers').delete().eq('id', id)
    loadData()
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
    setLoading(false)
  }

  const deleteClass = async (id: string) => {
    setLoading(true)
    await supabase.from('classes').delete().eq('id', id)
    loadData()
  }

  const deleteStudent = async (id: string) => {
    setLoading(true)
    await supabase.from('students').delete().eq('id', id)
    loadData()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('settingsPage.title')}</h1>
        <p className="text-muted-foreground">
          {t('settingsPage.description')}
        </p>
      </div>

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Student
              </CardTitle>
              <CardDescription>Enter student details to add to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                  <Label htmlFor="student-roll">Roll No</Label>
                  <Input
                    id="student-roll"
                    placeholder="e.g., 001"
                    value={studentForm.roll_no}
                    onChange={(e) => setStudentForm({ ...studentForm, roll_no: e.target.value })}
                  />
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
              <Button onClick={addStudent} className="mt-4" disabled={loading || schools.length === 0}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Add Student
              </Button>
              {schools.length === 0 && (
                <p className="text-sm text-orange-600 mt-2">Please add a school first before adding students.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registered Students ({students.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No students added yet. Add your first student above.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Parent Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{schools.find(s => s.id === student.school_id)?.name || "-"}</TableCell>
                        <TableCell>{classes.find(c => c.id === student.class_id)?.name || "-"}</TableCell>
                        <TableCell>{student.roll_no || "-"}</TableCell>
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
