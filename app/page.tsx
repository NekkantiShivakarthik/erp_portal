"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Lock, User, Building2, Eye, EyeOff, Shield, BookOpen, PenTool, Calculator, Globe, Microscope } from "lucide-react"
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
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  // Clear previous user data when login page loads (logout effect)
  useEffect(() => {
    localStorage.removeItem('userType')
    localStorage.removeItem('employeeId')
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
      // Query database for user with matching employee_id and password
      const { data: user, error: dbError } = await supabase
        .from('teachers')
        .select('*, schools(name)')
        .eq('employee_id', employeeId)
        .eq('password', password)
        .single()
      
      if (dbError || !user) {
        setError("Invalid Employee ID or Password. Please register first in the Settings page.")
        setIsLoading(false)
        return
      }

      // Check if role matches selected user type
      if (user.role !== userType) {
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
      {/* Floating Educational Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BookOpen className="absolute top-[10%] left-[5%] h-16 w-16 text-primary/10 animate-pulse" />
        <GraduationCap className="absolute top-[15%] right-[10%] h-20 w-20 text-primary/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <PenTool className="absolute bottom-[20%] left-[8%] h-12 w-12 text-primary/10 animate-pulse" style={{ animationDelay: '1s' }} />
        <Calculator className="absolute top-[60%] right-[5%] h-14 w-14 text-primary/10 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <Globe className="absolute bottom-[10%] right-[15%] h-18 w-18 text-primary/10 animate-pulse" style={{ animationDelay: '2s' }} />
        <Microscope className="absolute top-[40%] left-[3%] h-10 w-10 text-primary/10 animate-pulse" style={{ animationDelay: '0.8s' }} />
        
        {/* Decorative circles */}
        <div className="absolute top-[5%] right-[30%] h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[15%] left-[20%] h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute top-[50%] right-[10%] h-24 w-24 rounded-full bg-chart-2/10 blur-2xl" />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-xl border border-border/50">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  ShikshaSetu
                </h1>
                <p className="text-xs text-muted-foreground">Government School Portal</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Secure platform for teachers and officials to monitor, support, and improve government schools
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-lg hover-lift">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Official Login</CardTitle>
            <CardDescription className="text-center">
              Enter your official credentials issued by the Education Department
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
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                disabled={isLoading || !userType}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-2">ℹ️ How to Login</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>1. First, register users in the <strong>Settings → Teachers</strong> tab</p>
                  <p>2. Create Employee ID and Password during registration</p>
                  <p>3. Select your role and enter credentials to login</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>This is a restricted government portal. Unauthorized access is prohibited.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 Department of Education, Government of India
          </p>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Use</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Help</span>
          </div>
        </div>
      </div>
    </div>
  )
}
