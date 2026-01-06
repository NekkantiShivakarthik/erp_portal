// Demo Data Store - Works without Supabase
// This provides a complete offline experience

export interface DemoSchool {
  id: string
  name: string
  code: string
  district: string
  address: string
  created_at: string
  updated_at: string
}

export interface DemoTeacher {
  id: string
  name: string
  employee_id: string
  password: string
  role: 'teacher' | 'headmaster'
  email: string
  phone: string
  subject: string
  school_id: string
  created_at: string
  updated_at: string
}

export interface DemoClass {
  id: string
  name: string
  grade: number
  section: string
  school_id: string
  created_at: string
  updated_at: string
}

export interface DemoStudent {
  id: string
  name: string
  roll_no: string
  password: string
  class_id: string
  school_id: string
  parent_phone: string
  created_at: string
  updated_at: string
}

export interface DemoAttendance {
  id: string
  student_id: string
  class_id: string
  date: string
  status: 'present' | 'absent' | 'late'
  marked_by: string
  created_at: string
}

export interface DemoInfrastructureIssue {
  id: string
  title: string
  description: string
  category: string
  status: 'pending' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  school_id: string
  reported_by: string
  created_at: string
  updated_at: string
}

// Generate IDs
const generateId = () => `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
const now = new Date().toISOString()

// Demo School
export const demoSchools: DemoSchool[] = [
  {
    id: 'school-001',
    name: 'Government High School',
    code: 'GHS-001',
    district: 'Bangalore Urban',
    address: '123 Education Street, Bangalore - 560001',
    created_at: now,
    updated_at: now
  }
]

// Demo Classes (1-10)
export const demoClasses: DemoClass[] = [
  { id: 'class-01', name: 'Class 1-A', grade: 1, section: 'A', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'class-02', name: 'Class 2-A', grade: 2, section: 'A', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'class-03', name: 'Class 3-A', grade: 3, section: 'A', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'class-04', name: 'Class 4-A', grade: 4, section: 'A', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'class-05', name: 'Class 5-A', grade: 5, section: 'A', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'class-06', name: 'Class 6-A', grade: 6, section: 'A', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'class-07', name: 'Class 7-A', grade: 7, section: 'A', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'class-08', name: 'Class 8-A', grade: 8, section: 'A', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'class-09', name: 'Class 9-A', grade: 9, section: 'A', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'class-10', name: 'Class 10-A', grade: 10, section: 'A', school_id: 'school-001', created_at: now, updated_at: now },
]

// Demo Teachers (1 Headmaster + 5 Teachers)
export const demoTeachers: DemoTeacher[] = [
  { id: 'teacher-hm', name: 'Rajesh Kumar', employee_id: 'HM001', password: 'headmaster123', role: 'headmaster', email: 'rajesh@school.gov.in', phone: '9876543210', subject: 'Administration', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'teacher-01', name: 'Priya Sharma', employee_id: 'TCH001', password: 'teacher123', role: 'teacher', email: 'priya@school.gov.in', phone: '9876543211', subject: 'Mathematics', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'teacher-02', name: 'Arun Verma', employee_id: 'TCH002', password: 'teacher123', role: 'teacher', email: 'arun@school.gov.in', phone: '9876543212', subject: 'Science', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'teacher-03', name: 'Lakshmi Devi', employee_id: 'TCH003', password: 'teacher123', role: 'teacher', email: 'lakshmi@school.gov.in', phone: '9876543213', subject: 'English', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'teacher-04', name: 'Mohammed Ali', employee_id: 'TCH004', password: 'teacher123', role: 'teacher', email: 'ali@school.gov.in', phone: '9876543214', subject: 'Social Studies', school_id: 'school-001', created_at: now, updated_at: now },
  { id: 'teacher-05', name: 'Sunita Rao', employee_id: 'TCH005', password: 'teacher123', role: 'teacher', email: 'sunita@school.gov.in', phone: '9876543215', subject: 'Hindi', school_id: 'school-001', created_at: now, updated_at: now },
]

// Demo Students (5 per class for classes 8, 9, 10)
export const demoStudents: DemoStudent[] = [
  // Special demo student for easy login
  { id: 'student-demo', name: 'Demo Student', roll_no: 'STU001', password: 'student123', class_id: 'class-10', school_id: 'school-001', parent_phone: '9812345000', created_at: now, updated_at: now },
  // Class 10 Students
  { id: 'student-1001', name: 'Amit Patel', roll_no: 'STU1001', password: 'student123', class_id: 'class-10', school_id: 'school-001', parent_phone: '9812345001', created_at: now, updated_at: now },
  { id: 'student-1002', name: 'Sneha Gupta', roll_no: 'STU1002', password: 'student123', class_id: 'class-10', school_id: 'school-001', parent_phone: '9812345002', created_at: now, updated_at: now },
  { id: 'student-1003', name: 'Rahul Singh', roll_no: 'STU1003', password: 'student123', class_id: 'class-10', school_id: 'school-001', parent_phone: '9812345003', created_at: now, updated_at: now },
  { id: 'student-1004', name: 'Ananya Reddy', roll_no: 'STU1004', password: 'student123', class_id: 'class-10', school_id: 'school-001', parent_phone: '9812345004', created_at: now, updated_at: now },
  { id: 'student-1005', name: 'Vikram Joshi', roll_no: 'STU1005', password: 'student123', class_id: 'class-10', school_id: 'school-001', parent_phone: '9812345005', created_at: now, updated_at: now },
  // Class 9 Students
  { id: 'student-0901', name: 'Meera Nair', roll_no: 'STU0901', password: 'student123', class_id: 'class-09', school_id: 'school-001', parent_phone: '9812345006', created_at: now, updated_at: now },
  { id: 'student-0902', name: 'Arjun Menon', roll_no: 'STU0902', password: 'student123', class_id: 'class-09', school_id: 'school-001', parent_phone: '9812345007', created_at: now, updated_at: now },
  { id: 'student-0903', name: 'Kavya Sharma', roll_no: 'STU0903', password: 'student123', class_id: 'class-09', school_id: 'school-001', parent_phone: '9812345008', created_at: now, updated_at: now },
  { id: 'student-0904', name: 'Sanjay Kumar', roll_no: 'STU0904', password: 'student123', class_id: 'class-09', school_id: 'school-001', parent_phone: '9812345009', created_at: now, updated_at: now },
  { id: 'student-0905', name: 'Divya Pillai', roll_no: 'STU0905', password: 'student123', class_id: 'class-09', school_id: 'school-001', parent_phone: '9812345010', created_at: now, updated_at: now },
  // Class 8 Students
  { id: 'student-0801', name: 'Rohan Das', roll_no: 'STU0801', password: 'student123', class_id: 'class-08', school_id: 'school-001', parent_phone: '9812345011', created_at: now, updated_at: now },
  { id: 'student-0802', name: 'Priyanka Iyer', roll_no: 'STU0802', password: 'student123', class_id: 'class-08', school_id: 'school-001', parent_phone: '9812345012', created_at: now, updated_at: now },
  { id: 'student-0803', name: 'Karthik Rajan', roll_no: 'STU0803', password: 'student123', class_id: 'class-08', school_id: 'school-001', parent_phone: '9812345013', created_at: now, updated_at: now },
  { id: 'student-0804', name: 'Anjali Bose', roll_no: 'STU0804', password: 'student123', class_id: 'class-08', school_id: 'school-001', parent_phone: '9812345014', created_at: now, updated_at: now },
  { id: 'student-0805', name: 'Vivek Saxena', roll_no: 'STU0805', password: 'student123', class_id: 'class-08', school_id: 'school-001', parent_phone: '9812345015', created_at: now, updated_at: now },
  // Class 7 Students
  { id: 'student-0701', name: 'Neha Kapoor', roll_no: 'STU0701', password: 'student123', class_id: 'class-07', school_id: 'school-001', parent_phone: '9812345016', created_at: now, updated_at: now },
  { id: 'student-0702', name: 'Aditya Rao', roll_no: 'STU0702', password: 'student123', class_id: 'class-07', school_id: 'school-001', parent_phone: '9812345017', created_at: now, updated_at: now },
  { id: 'student-0703', name: 'Pooja Mehta', roll_no: 'STU0703', password: 'student123', class_id: 'class-07', school_id: 'school-001', parent_phone: '9812345018', created_at: now, updated_at: now },
  // Class 6 Students
  { id: 'student-0601', name: 'Ravi Shankar', roll_no: 'STU0601', password: 'student123', class_id: 'class-06', school_id: 'school-001', parent_phone: '9812345019', created_at: now, updated_at: now },
  { id: 'student-0602', name: 'Deepa Nair', roll_no: 'STU0602', password: 'student123', class_id: 'class-06', school_id: 'school-001', parent_phone: '9812345020', created_at: now, updated_at: now },
]

// Generate demo attendance for the past 30 days
const generateDemoAttendance = (): DemoAttendance[] => {
  const attendance: DemoAttendance[] = []
  const statuses: ('present' | 'absent' | 'late')[] = ['present', 'present', 'present', 'present', 'absent', 'late']
  
  for (let day = 0; day < 30; day++) {
    const date = new Date()
    date.setDate(date.getDate() - day)
    const dateStr = date.toISOString().split('T')[0]
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue
    
    demoStudents.forEach(student => {
      attendance.push({
        id: `att-${student.id}-${dateStr}`,
        student_id: student.id,
        class_id: student.class_id,
        date: dateStr,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        marked_by: 'teacher-01',
        created_at: date.toISOString()
      })
    })
  }
  
  return attendance
}

export const demoAttendance: DemoAttendance[] = generateDemoAttendance()

// Demo Infrastructure Issues
export const demoInfrastructureIssues: DemoInfrastructureIssue[] = [
  { id: 'issue-001', title: 'Broken Window in Class 8', description: 'Window glass is cracked and needs replacement', category: 'Building', status: 'pending', priority: 'medium', school_id: 'school-001', reported_by: 'teacher-01', created_at: now, updated_at: now },
  { id: 'issue-002', title: 'Water Leakage in Boys Toilet', description: 'Pipe leaking near washbasin area', category: 'Plumbing', status: 'in-progress', priority: 'high', school_id: 'school-001', reported_by: 'teacher-02', created_at: now, updated_at: now },
  { id: 'issue-003', title: 'Projector Not Working', description: 'Projector in computer lab shows no display', category: 'Equipment', status: 'resolved', priority: 'low', school_id: 'school-001', reported_by: 'teacher-03', created_at: now, updated_at: now },
]

// Demo Data Store Class - For managing data with localStorage persistence
export class DemoDataStore {
  private static instance: DemoDataStore
  
  schools: DemoSchool[] = [...demoSchools]
  teachers: DemoTeacher[] = [...demoTeachers]
  classes: DemoClass[] = [...demoClasses]
  students: DemoStudent[] = [...demoStudents]
  attendance: DemoAttendance[] = [...demoAttendance]
  infrastructureIssues: DemoInfrastructureIssue[] = [...demoInfrastructureIssues]
  
  private constructor() {
    this.loadFromStorage()
  }
  
  static getInstance(): DemoDataStore {
    if (!DemoDataStore.instance) {
      DemoDataStore.instance = new DemoDataStore()
    }
    return DemoDataStore.instance
  }
  
  private loadFromStorage() {
    if (typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem('erp_demo_data')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.schools) this.schools = data.schools
        if (data.teachers) this.teachers = data.teachers
        if (data.classes) this.classes = data.classes
        if (data.students) this.students = data.students
        if (data.attendance) this.attendance = data.attendance
        if (data.infrastructureIssues) this.infrastructureIssues = data.infrastructureIssues
      }
    } catch (e) {
      console.warn('Could not load demo data from storage')
    }
  }
  
  private saveToStorage() {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('erp_demo_data', JSON.stringify({
        schools: this.schools,
        teachers: this.teachers,
        classes: this.classes,
        students: this.students,
        attendance: this.attendance,
        infrastructureIssues: this.infrastructureIssues
      }))
    } catch (e) {
      console.warn('Could not save demo data to storage')
    }
  }
  
  // Student CRUD
  addStudent(student: Omit<DemoStudent, 'id' | 'created_at' | 'updated_at'> | any): DemoStudent {
    const newStudent: DemoStudent = {
      ...student,
      id: student.id || generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.students.push(newStudent)
    this.saveToStorage()
    return newStudent
  }
  
  updateStudent(id: string, updates: Partial<DemoStudent>): DemoStudent | null {
    const index = this.students.findIndex(s => s.id === id)
    if (index === -1) return null
    this.students[index] = { ...this.students[index], ...updates, updated_at: new Date().toISOString() }
    this.saveToStorage()
    return this.students[index]
  }
  
  deleteStudent(id: string): boolean {
    const index = this.students.findIndex(s => s.id === id)
    if (index === -1) return false
    this.students.splice(index, 1)
    this.saveToStorage()
    return true
  }
  
  // Teacher CRUD
  addTeacher(teacher: Omit<DemoTeacher, 'id' | 'created_at' | 'updated_at'> | any): DemoTeacher {
    const newTeacher: DemoTeacher = {
      ...teacher,
      id: teacher.id || generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.teachers.push(newTeacher)
    this.saveToStorage()
    return newTeacher
  }
  
  updateTeacher(id: string, updates: Partial<DemoTeacher>): DemoTeacher | null {
    const index = this.teachers.findIndex(t => t.id === id)
    if (index === -1) return null
    this.teachers[index] = { ...this.teachers[index], ...updates, updated_at: new Date().toISOString() }
    this.saveToStorage()
    return this.teachers[index]
  }
  
  deleteTeacher(id: string): boolean {
    const index = this.teachers.findIndex(t => t.id === id)
    if (index === -1) return false
    this.teachers.splice(index, 1)
    this.saveToStorage()
    return true
  }
  
  // Class CRUD
  addClass(cls: Omit<DemoClass, 'id' | 'created_at' | 'updated_at'> | any): DemoClass {
    const newClass: DemoClass = {
      ...cls,
      id: cls.id || generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.classes.push(newClass)
    this.saveToStorage()
    return newClass
  }
  
  deleteClass(id: string): boolean {
    const index = this.classes.findIndex(c => c.id === id)
    if (index === -1) return false
    this.classes.splice(index, 1)
    this.saveToStorage()
    return true
  }
  
  // School CRUD
  addSchool(school: Omit<DemoSchool, 'id' | 'created_at' | 'updated_at'>): DemoSchool {
    const newSchool: DemoSchool = {
      ...school,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.schools.push(newSchool)
    this.saveToStorage()
    return newSchool
  }
  
  deleteSchool(id: string): boolean {
    const index = this.schools.findIndex(s => s.id === id)
    if (index === -1) return false
    this.schools.splice(index, 1)
    this.saveToStorage()
    return true
  }
  
  // Attendance
  markAttendance(studentId: string, classId: string, date: string, status: 'present' | 'absent' | 'late', markedBy: string): DemoAttendance {
    // Remove existing attendance for this student on this date
    this.attendance = this.attendance.filter(a => !(a.student_id === studentId && a.date === date))
    
    const newAttendance: DemoAttendance = {
      id: generateId(),
      student_id: studentId,
      class_id: classId,
      date,
      status,
      marked_by: markedBy,
      created_at: new Date().toISOString()
    }
    this.attendance.push(newAttendance)
    this.saveToStorage()
    return newAttendance
  }
  
  getAttendanceByDate(date: string): DemoAttendance[] {
    return this.attendance.filter(a => a.date === date)
  }
  
  getStudentAttendance(studentId: string): DemoAttendance[] {
    return this.attendance.filter(a => a.student_id === studentId)
  }
  
  // Infrastructure Issues
  addInfrastructureIssue(issue: Omit<DemoInfrastructureIssue, 'id' | 'created_at' | 'updated_at'>): DemoInfrastructureIssue {
    const newIssue: DemoInfrastructureIssue = {
      ...issue,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.infrastructureIssues.push(newIssue)
    this.saveToStorage()
    return newIssue
  }
  
  // Stats
  getStats() {
    const totalStudents = this.students.length
    const totalTeachers = this.teachers.length
    const totalClasses = this.classes.length
    const totalSchools = this.schools.length
    
    const today = new Date().toISOString().split('T')[0]
    const todayAttendance = this.attendance.filter(a => a.date === today)
    const presentToday = todayAttendance.filter(a => a.status === 'present').length
    const attendanceRate = todayAttendance.length > 0 ? (presentToday / todayAttendance.length * 100) : 0
    
    const pendingIssues = this.infrastructureIssues.filter(i => i.status === 'pending').length
    
    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSchools,
      presentToday,
      attendanceRate,
      pendingIssues
    }
  }
  
  // Get students by class
  getStudentsByClass(classId: string): DemoStudent[] {
    return this.students.filter(s => s.class_id === classId)
  }
  
  // Reset to default demo data
  resetToDefault() {
    this.schools = [...demoSchools]
    this.teachers = [...demoTeachers]
    this.classes = [...demoClasses]
    this.students = [...demoStudents]
    this.attendance = generateDemoAttendance()
    this.infrastructureIssues = [...demoInfrastructureIssues]
    this.saveToStorage()
  }
}

// Export singleton instance
export const getDemoData = () => DemoDataStore.getInstance()
