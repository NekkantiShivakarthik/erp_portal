# ERP Portal - Demo Mode Guide

## Overview
The ERP Portal now works **completely offline** without requiring Supabase! This is perfect for demos, testing, and development.

## 🔐 Demo Login Credentials

### Teacher/Staff Login
| Role | ID | Password |
|------|-----|----------|
| **Headmaster** | `HM001` | `headmaster123` |
| Teacher 1 | `TCH001` | `teacher123` |
| Teacher 2 | `TCH002` | `teacher123` |
| Teacher 3 | `TCH003` | `teacher123` |
| Teacher 4 | `TCH004` | `teacher123` |
| Teacher 5 | `TCH005` | `teacher123` |

### Student Login
| Name | Roll Number | Password |
|------|-------------|----------|
| Demo Student | `STU001` | `student123` |
| Amit Patel | `STU1001` | `student123` |
| Sneha Gupta | `STU1002` | `student123` |
| Rahul Singh | `STU1003` | `student123` |
| (and more...) | `STU0901`-`STU0602` | `student123` |

## 🎯 How Demo Mode Works

### Automatic Fallback
When Supabase is unavailable (paused, not configured, or offline), the portal automatically:
1. Detects the connection issue
2. Loads demo data from `lib/demo-data.ts`
3. Shows a "Demo Mode" banner on each page
4. Enables full functionality with local storage persistence

### Data Persistence
- All changes (new students, attendance, etc.) are saved to **localStorage**
- Data persists across browser refreshes
- Use "Reset to Default" in Settings to restore original demo data

## 📊 Demo Data Included

### School
- **1 Government High School** (GHS-001)
- Located in Bangalore Urban district

### Classes
- **10 Classes**: Class 1-A through Class 10-A

### Teachers (6 total)
- 1 Headmaster (Rajesh Kumar)
- 5 Teachers (Priya Sharma, Arun Verma, Lakshmi Devi, Mohammed Ali, Sunita Rao)

### Students (21 total)
- Distributed across Classes 6-10
- Each has a unique roll number and password

### Infrastructure Issues (3)
- 1 Pending (Broken Window)
- 1 In Progress (Water Leakage)
- 1 Resolved (Projector)

### Attendance
- 30 days of generated attendance records
- Weekends excluded
- Random present/absent/late distribution

### Fund Allocations
- Samagra Shiksha: ₹15,00,000 (73% utilized)
- Mid Day Meal: ₹8,00,000 (81% utilized)
- Infrastructure: ₹5,00,000 (64% utilized)

## 🛠 Customizing Demo Data

Edit `lib/demo-data.ts` to:
- Add more schools, teachers, students
- Change attendance patterns
- Add more infrastructure issues
- Modify fund allocations

## 🌐 Switching to Production (Supabase)

1. Restore your Supabase project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Run the migrations in `supabase/migrations/`:
   - `001_create_erp_schema.sql` - Creates tables
   - `002_insert_demo_data.sql` - Adds initial data
3. Update `.env.local` with your Supabase URL and anon key
4. Restart the dev server

The portal will automatically detect Supabase and use real database data instead of demo data.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
http://localhost:3000
```

Then login with any of the demo credentials above!

## 📝 Notes

- Demo mode is indicated by an amber banner on each page
- All CRUD operations work in demo mode
- Data is stored in browser localStorage
- Different browsers/devices have separate demo data
- Clearing browser data will reset to default demo data

---

Built with ❤️ for Government Schools
