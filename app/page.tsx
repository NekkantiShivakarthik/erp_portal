"use client"

import { useState, useEffect } from "react"
import { GraduationCap, Lock, User, Building2, Eye, EyeOff, Shield, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  // Clear previous user data when login page loads (logout effect)
  useEffect(() => {
    localStorage.removeItem('userType')
    localStorage.removeItem('employeeId')
    localStorage.removeItem('rollNumber')
    localStorage.removeItem('studentId')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('schoolId')
    localStorage.removeItem('schoolName')
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      // Handle student login separately
      if (userType === "student") {
        // Check for demo student credentials (fallback if DB not set up)
        if ((rollNumber === "STU001" || rollNumber === "STU1001") && password === "student123") {
          // Try database first
          const { data: demoStudent } = await supabase
            .from('students')
            .select('*, schools(name)')
            .eq('roll_no', rollNumber)
            .eq('password', password)
            .single()
          
          if (demoStudent) {
            localStorage.setItem('userType', 'student')
            localStorage.setItem('rollNumber', rollNumber)
            localStorage.setItem('studentId', demoStudent.id)
            localStorage.setItem('userId', demoStudent.id)
            localStorage.setItem('userName', demoStudent.name)
            localStorage.setItem('schoolId', demoStudent.school_id || '')
            localStorage.setItem('schoolName', (demoStudent.schools as any)?.name || '')
            window.location.href = "/dashboard/student"
            return
          }
          
          // Fallback demo student login - no database required
          localStorage.setItem('userType', 'student')
          localStorage.setItem('rollNumber', rollNumber)
          localStorage.setItem('studentId', 'demo-student-001')
          localStorage.setItem('userId', 'demo-student-001')
          localStorage.setItem('userName', 'Demo Student')
          localStorage.setItem('schoolId', 'demo-school-001')
          localStorage.setItem('schoolName', 'Demo Government School')
          
          window.location.href = "/dashboard/student"
          return
        }

        // Regular student login from database
        const { data: student, error: dbError } = await supabase
          .from('students')
          .select('*, schools(name)')
          .eq('roll_no', rollNumber)  // Database column is roll_no
          .eq('password', password)
          .single()
        
        if (dbError || !student) {
          setError("Invalid Roll Number or Password. Please contact your teacher.")
          setIsLoading(false)
          return
        }

        // Store student info in localStorage
        localStorage.setItem('userType', 'student')
        localStorage.setItem('rollNumber', rollNumber)
        localStorage.setItem('studentId', student.id)
        localStorage.setItem('userId', student.id)
        localStorage.setItem('userName', student.name)
        localStorage.setItem('schoolId', student.school_id || '')
        localStorage.setItem('schoolName', (student.schools as any)?.name || '')
        
        window.location.href = "/dashboard/student"
        return
      }

      // Handle teacher/official/headmaster login
      const { data: user, error: dbError } = await supabase
        .from('teachers')
        .select('*, schools(name)')
        .eq('employee_id', employeeId)
        .eq('password', password)
        .single()
      
      if (dbError || !user) {
        // Demo fallback - check for demo credentials
        const demoCredentials: Record<string, { password: string, role: string, name: string }> = {
          'HM001': { password: 'headmaster123', role: 'headmaster', name: 'Rajesh Kumar (Demo)' },
          'TCH001': { password: 'teacher123', role: 'teacher', name: 'Priya Sharma (Demo)' },
          'TCH002': { password: 'teacher123', role: 'teacher', name: 'Arun Verma (Demo)' },
          'TCH003': { password: 'teacher123', role: 'teacher', name: 'Lakshmi Devi (Demo)' },
          'TCH004': { password: 'teacher123', role: 'teacher', name: 'Mohammed Ali (Demo)' },
          'TCH005': { password: 'teacher123', role: 'teacher', name: 'Sunita Rao (Demo)' },
        }
        
        const demo = demoCredentials[employeeId]
        if (demo && demo.password === password) {
          // Check if role matches
          if ((userType === 'teacher' && demo.role === 'teacher') || 
              (userType === 'headmaster' && demo.role === 'headmaster') ||
              (userType === 'official' && demo.role === 'headmaster')) {
            localStorage.setItem('userType', demo.role)
            localStorage.setItem('employeeId', employeeId)
            localStorage.setItem('userId', `demo-${employeeId}`)
            localStorage.setItem('userName', demo.name)
            localStorage.setItem('schoolId', 'demo-school-001')
            localStorage.setItem('schoolName', 'Demo Government School')
            
            if (demo.role === 'headmaster') {
              window.location.href = "/dashboard/teacher"
            } else {
              window.location.href = "/dashboard/teacher"
            }
            return
          }
        }
        
        setError("Invalid Employee ID or Password. Please check your credentials or set up demo data in Settings.")
        setIsLoading(false)
        return
      }

      // Check if role matches selected user type (allow headmaster to login as teacher)
      if (user.role !== userType && !(user.role === 'headmaster' && (userType === 'teacher' || userType === 'headmaster'))) {
        setError(`This account is registered as "${user.role}". Please select the correct role.`)
        setIsLoading(false)
        return
      }

      // Store user info in localStorage
      localStorage.setItem('userType', user.role || userType)
      localStorage.setItem('employeeId', employeeId)
      localStorage.setItem('userId', user.id)
      localStorage.setItem('userName', user.name)
      localStorage.setItem('schoolId', user.school_id || '')
      localStorage.setItem('schoolName', (user.schools as any)?.name || '')
      
      // Force full page reload to ensure header picks up new user
      // Redirect based on role
      if (user.role === "teacher" || user.role === "headmaster") {
        window.location.href = "/dashboard/teacher"
      } else if (user.role === "official") {
        window.location.href = "/dashboard/official"
      } else {
        window.location.href = "/dashboard/teacher"
      }
      return
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen gradient-mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Kawaii Background Shapes 🌸 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] right-[30%] h-40 w-40 rounded-full bg-pink-400/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-[15%] left-[20%] h-56 w-56 rounded-full bg-purple-300/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[50%] right-[10%] h-32 w-32 rounded-full bg-sky-300/20 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[70%] left-[40%] h-24 w-24 rounded-full bg-rose-300/15 blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Floating Cute Icons 💕 */}
        <div className="absolute top-[10%] left-[5%] text-4xl animate-bounce opacity-30" style={{ animationDuration: '3s' }}>🌸</div>
        <div className="absolute top-[15%] right-[10%] text-5xl animate-bounce opacity-25" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>✨</div>
        <div className="absolute bottom-[20%] left-[8%] text-3xl animate-bounce opacity-30" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>💖</div>
        <div className="absolute top-[60%] right-[5%] text-4xl animate-bounce opacity-25" style={{ animationDuration: '4s', animationDelay: '1.5s' }}>🎀</div>
        <div className="absolute bottom-[10%] right-[15%] text-4xl animate-bounce opacity-30" style={{ animationDuration: '3s', animationDelay: '2s' }}>⭐</div>
        <div className="absolute top-[40%] left-[3%] text-3xl animate-bounce opacity-25" style={{ animationDuration: '3.5s', animationDelay: '0.8s' }}>🌟</div>
        <BookOpen className="absolute top-[25%] left-[15%] h-12 w-12 text-pink-300/30 animate-bounce" style={{ animationDuration: '3s' }} />
        <GraduationCap className="absolute bottom-[30%] right-[20%] h-14 w-14 text-purple-300/30 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="relative w-full max-w-md z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 bg-card/90 backdrop-blur-xl rounded-3xl px-6 py-4 shadow-2xl border-2 border-pink-200/50 dark:border-pink-800/30 hover-lift">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg pulse-glow">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  ShikshaSetu ✨
                </h1>
                <p className="text-sm text-muted-foreground">Government School Portal 🎀</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-4">
            ✨ Secure platform for teachers and officials to monitor, support, and improve government schools 💕
          </p>
        </div>

        <Card className="border-2 border-pink-200/50 dark:border-pink-800/30 shadow-2xl bg-card/90 backdrop-blur-xl hover-lift overflow-hidden rounded-3xl">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400" />
          <CardHeader className="space-y-1 pb-4 pt-6">
            <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Welcome Back 💖</CardTitle>
            <CardDescription className="text-center text-base">
              Enter your official credentials to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType">Login As</Label>
                <Select value={userType} onValueChange={setUserType} required>
                  <SelectTrigger id="userType">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>Student</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="teacher">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Teacher</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="headmaster">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>School Headmaster / Administrator</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="official">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Government Education Official</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userType === "student" ? (
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="rollNumber"
                      placeholder="Enter your Roll Number"
                      className="pl-10"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="employeeId"
                      placeholder="Enter your official Employee ID"
                      className="pl-10"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg text-base py-6 font-semibold transition-all hover:shadow-xl hover:scale-[1.02]"
                disabled={isLoading || !userType}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 pt-4 border-t border-border/50">
              {userType === "student" && (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">🎓</span>
                    Demo Student Credentials
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between bg-background/60 rounded-lg px-4 py-2.5">
                      <span className="text-muted-foreground">Roll Number:</span>
                      <code className="font-mono font-bold text-green-600 dark:text-green-400">STU001</code>
                    </div>
                    <div className="flex items-center justify-between bg-background/60 rounded-lg px-4 py-2.5">
                      <span className="text-muted-foreground">Password:</span>
                      <code className="font-mono font-bold text-green-600 dark:text-green-400">student123</code>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">ℹ️</span>
                  How to Login
                </h4>
                {userType === "student" ? (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2"><span className="font-bold text-primary">1.</span> Students are registered in <strong className="text-foreground">Dashboard → Student</strong></p>
                    <p className="flex items-start gap-2"><span className="font-bold text-primary">2.</span> Use your Roll Number and Password provided by your teacher</p>
                    <p className="flex items-start gap-2"><span className="font-bold text-primary">3.</span> Access attendance records and learning resources</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2"><span className="font-bold text-primary">1.</span> First, register users in the <strong className="text-foreground">Settings → Teachers</strong> tab</p>
                    <p className="flex items-start gap-2"><span className="font-bold text-primary">2.</span> Create Employee ID and Password during registration</p>
                    <p className="flex items-start gap-2"><span className="font-bold text-primary">3.</span> Select your role and enter credentials to login</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                <Shield className="h-4 w-4 text-primary" />
                <span>This is a restricted government portal. Unauthorized access is prohibited.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            © 2026 Department of Education, Government of India
          </p>
          <div className="flex items-center justify-center gap-6 mt-3 text-sm text-muted-foreground">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-border">•</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Use</span>
            <span className="text-border">•</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Help</span>
          </div>
        </div>
      </div>
    </div>
  )
}
