-- =============================================
-- ShikshaSetu ERP Portal - Demo Data
-- Run this AFTER running 001_create_erp_schema.sql
-- =============================================

-- Insert Demo School
INSERT INTO schools (name, code, district, address) VALUES
  ('Government High School', 'GHS-001', 'Bangalore Urban', '123 Education Street, Bangalore - 560001');

-- Get school ID for foreign keys
DO $$
DECLARE
  school_id uuid;
  class_8_id uuid;
  class_9_id uuid;
  class_10_id uuid;
BEGIN
  SELECT id INTO school_id FROM schools WHERE code = 'GHS-001';
  
  -- Insert Classes (1-10)
  INSERT INTO classes (name, grade, section, school_id) VALUES
    ('Class 1-A', 1, 'A', school_id),
    ('Class 2-A', 2, 'A', school_id),
    ('Class 3-A', 3, 'A', school_id),
    ('Class 4-A', 4, 'A', school_id),
    ('Class 5-A', 5, 'A', school_id),
    ('Class 6-A', 6, 'A', school_id),
    ('Class 7-A', 7, 'A', school_id),
    ('Class 8-A', 8, 'A', school_id),
    ('Class 9-A', 9, 'A', school_id),
    ('Class 10-A', 10, 'A', school_id);
  
  -- Get class IDs
  SELECT id INTO class_8_id FROM classes WHERE grade = 8 AND school_id = school_id LIMIT 1;
  SELECT id INTO class_9_id FROM classes WHERE grade = 9 AND school_id = school_id LIMIT 1;
  SELECT id INTO class_10_id FROM classes WHERE grade = 10 AND school_id = school_id LIMIT 1;
  
  -- Insert Teachers (1 Headmaster + 5 Teachers)
  INSERT INTO teachers (name, employee_id, password, role, email, phone, subject, school_id) VALUES
    ('Rajesh Kumar', 'HM001', 'headmaster123', 'headmaster', 'rajesh@school.gov.in', '9876543210', 'Administration', school_id),
    ('Priya Sharma', 'TCH001', 'teacher123', 'teacher', 'priya@school.gov.in', '9876543211', 'Mathematics', school_id),
    ('Arun Verma', 'TCH002', 'teacher123', 'teacher', 'arun@school.gov.in', '9876543212', 'Science', school_id),
    ('Lakshmi Devi', 'TCH003', 'teacher123', 'teacher', 'lakshmi@school.gov.in', '9876543213', 'English', school_id),
    ('Mohammed Ali', 'TCH004', 'teacher123', 'teacher', 'ali@school.gov.in', '9876543214', 'Social Studies', school_id),
    ('Sunita Rao', 'TCH005', 'teacher123', 'teacher', 'sunita@school.gov.in', '9876543215', 'Hindi', school_id);
  
  -- Insert Students (15 students across classes 8, 9, 10)
  INSERT INTO students (name, roll_no, password, class_id, school_id, parent_phone) VALUES
    -- Class 10 Students
    ('Amit Patel', 'STU1001', 'student123', class_10_id, school_id, '9812345001'),
    ('Sneha Gupta', 'STU1002', 'student123', class_10_id, school_id, '9812345002'),
    ('Rahul Singh', 'STU1003', 'student123', class_10_id, school_id, '9812345003'),
    ('Ananya Reddy', 'STU1004', 'student123', class_10_id, school_id, '9812345004'),
    ('Vikram Joshi', 'STU1005', 'student123', class_10_id, school_id, '9812345005'),
    -- Class 9 Students
    ('Meera Nair', 'STU0901', 'student123', class_9_id, school_id, '9812345006'),
    ('Arjun Menon', 'STU0902', 'student123', class_9_id, school_id, '9812345007'),
    ('Kavya Sharma', 'STU0903', 'student123', class_9_id, school_id, '9812345008'),
    ('Sanjay Kumar', 'STU0904', 'student123', class_9_id, school_id, '9812345009'),
    ('Divya Pillai', 'STU0905', 'student123', class_9_id, school_id, '9812345010'),
    -- Class 8 Students
    ('Rohan Das', 'STU0801', 'student123', class_8_id, school_id, '9812345011'),
    ('Priyanka Iyer', 'STU0802', 'student123', class_8_id, school_id, '9812345012'),
    ('Karthik Rajan', 'STU0803', 'student123', class_8_id, school_id, '9812345013'),
    ('Anjali Bose', 'STU0804', 'student123', class_8_id, school_id, '9812345014'),
    ('Vivek Saxena', 'STU0805', 'student123', class_8_id, school_id, '9812345015');
  
  RAISE NOTICE 'Demo data inserted successfully!';
END $$;

-- =============================================
-- Login Credentials Summary:
-- =============================================
-- HEADMASTER:
--   Employee ID: HM001
--   Password: headmaster123
--
-- TEACHERS:
--   Employee ID: TCH001-TCH005
--   Password: teacher123
--
-- STUDENTS (Class 10):
--   Roll No: STU1001-STU1005
--   Password: student123
--
-- STUDENTS (Class 9):
--   Roll No: STU0901-STU0905
--   Password: student123
--
-- STUDENTS (Class 8):
--   Roll No: STU0801-STU0805
--   Password: student123
-- =============================================
