-- =============================================
-- ShikshaSetu ERP Portal - Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Create Schools Table
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE,
  district text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade integer,
  section text,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  employee_id text UNIQUE,
  password text,
  email text,
  phone text,
  subject text,
  role text DEFAULT 'teacher',
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Students Table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  roll_no text,
  password text,
  parent_phone text,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL,
  marked_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create Infrastructure Issues Table
CREATE TABLE IF NOT EXISTS infrastructure_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  reported_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create Teacher Tasks Table
CREATE TABLE IF NOT EXISTS teacher_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  due_date date,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text,
  entity_id text,
  teacher_id uuid REFERENCES teachers(id) ON DELETE SET NULL,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  type text,
  severity text DEFAULT 'info',
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create Funds Table
CREATE TABLE IF NOT EXISTS funds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  amount decimal(12,2) NOT NULL,
  type text,
  category text,
  description text,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text,
  url text,
  subject text,
  grade integer,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- Enable Row Level Security
-- =============================================
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Create RLS Policies (Allow all for demo)
-- =============================================
DO $$ 
BEGIN
  -- Schools
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schools' AND policyname = 'Allow all for schools') THEN
    CREATE POLICY "Allow all for schools" ON schools FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  -- Classes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'classes' AND policyname = 'Allow all for classes') THEN
    CREATE POLICY "Allow all for classes" ON classes FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  -- Teachers
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Allow all for teachers') THEN
    CREATE POLICY "Allow all for teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  -- Students
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Allow all for students') THEN
    CREATE POLICY "Allow all for students" ON students FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  -- Attendance
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'attendance' AND policyname = 'Allow all for attendance') THEN
    CREATE POLICY "Allow all for attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  -- Infrastructure Issues
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'infrastructure_issues' AND policyname = 'Allow all for infrastructure_issues') THEN
    CREATE POLICY "Allow all for infrastructure_issues" ON infrastructure_issues FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  -- Teacher Tasks
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teacher_tasks' AND policyname = 'Allow all for teacher_tasks') THEN
    CREATE POLICY "Allow all for teacher_tasks" ON teacher_tasks FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  -- Activities
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activities' AND policyname = 'Allow all for activities') THEN
    CREATE POLICY "Allow all for activities" ON activities FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  -- Alerts
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'alerts' AND policyname = 'Allow all for alerts') THEN
    CREATE POLICY "Allow all for alerts" ON alerts FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  -- Funds
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funds' AND policyname = 'Allow all for funds') THEN
    CREATE POLICY "Allow all for funds" ON funds FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  -- Resources
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resources' AND policyname = 'Allow all for resources') THEN
    CREATE POLICY "Allow all for resources" ON resources FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- =============================================
-- Create Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_employee_id ON teachers(employee_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_infrastructure_issues_school_id ON infrastructure_issues(school_id);
CREATE INDEX IF NOT EXISTS idx_infrastructure_issues_status ON infrastructure_issues(status);
CREATE INDEX IF NOT EXISTS idx_activities_school_id ON activities(school_id);
CREATE INDEX IF NOT EXISTS idx_funds_school_id ON funds(school_id);

-- =============================================
-- Success message
-- =============================================
DO $$ 
BEGIN
  RAISE NOTICE 'ShikshaSetu ERP Schema created successfully!';
END $$;
