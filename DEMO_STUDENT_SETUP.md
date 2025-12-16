# Demo Student Setup

## Demo Credentials
- **Roll Number:** STU001
- **Password:** student123

## Database Setup

To create the demo student, run this SQL in your Supabase SQL Editor:

```sql
-- Insert demo student
INSERT INTO students (
  name,
  roll_number,
  password,
  class,
  section,
  school_id
) VALUES (
  'Demo Student',
  'STU001',
  'student123',
  '10',
  'A',
  (SELECT id FROM schools LIMIT 1)
)
ON CONFLICT (roll_number) DO NOTHING;

-- Insert sample attendance records for the demo student (last 30 days)
DO $$
DECLARE
  student_id UUID;
  i INTEGER;
  attendance_date DATE;
  status_val TEXT;
BEGIN
  -- Get the demo student ID
  SELECT id INTO student_id FROM students WHERE roll_number = 'STU001';
  
  -- Insert 30 days of attendance
  FOR i IN 0..29 LOOP
    attendance_date := CURRENT_DATE - i;
    
    -- Generate realistic attendance pattern (mostly present, some absent, few late)
    IF i % 7 IN (0, 6) THEN
      -- Weekend - skip or mark absent
      status_val := 'absent';
    ELSIF i % 15 = 0 THEN
      status_val := 'late';
    ELSIF i % 10 = 0 THEN
      status_val := 'absent';
    ELSE
      status_val := 'present';
    END IF;
    
    INSERT INTO attendance (
      student_id,
      date,
      status,
      school_id
    ) VALUES (
      student_id,
      attendance_date,
      status_val,
      (SELECT school_id FROM students WHERE id = student_id)
    )
    ON CONFLICT (student_id, date) DO NOTHING;
  END LOOP;
END $$;
```

## What the Demo Student Can Access

After logging in with the demo credentials, students can:

1. **Dashboard** (`/dashboard/student`)
   - View attendance statistics (rate, present days, absent days, late arrivals)
   - See 30-day attendance history with color-coded status badges
   - Preview learning resources

2. **Learning Resources** (`/dashboard/student/resources`)
   - Study materials (PDFs, documents)
   - Video lessons
   - Practice tests
   - Search and filter resources

## Multi-Language Support

The student portal supports 3 languages:
- English (en)
- Kannada (ಕನ್ನಡ) (kn)
- Telugu (తెలుగు) (te)

Students can switch languages using the language switcher in the header.
