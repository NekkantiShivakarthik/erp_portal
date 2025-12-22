"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Camera, 
  Upload,
  Building2,
  Droplets,
  Lightbulb,
  Armchair,
  AlertTriangle,
  Send,
  ImagePlus,
  X,
  Loader2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const categories = [
  { value: "Classroom", label: "Classroom/Building", icon: Building2 },
  { value: "Plumbing", label: "Plumbing/Sanitation", icon: Droplets },
  { value: "Electricity", label: "Electrical", icon: Lightbulb },
  { value: "Furniture", label: "Furniture", icon: Armchair },
  { value: "Toilet", label: "Toilet", icon: Droplets },
  { value: "Other", label: "Other", icon: AlertTriangle },
]

export default function ReportIssuePage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [schools, setSchools] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    school_id: '',
    category: '',
    title: '',
    description: '',
    priority: 'medium',
  })

  useEffect(() => {
    loadSchools()
  }, [])

  const loadSchools = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('schools').select('*')
    if (error) {
      console.error('Error loading schools:', error)
      toast.error('Failed to load schools')
    }
    setSchools(data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      school_id: '',
      category: '',
      title: '',
      description: '',
      priority: 'medium',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.school_id || !formData.category || !formData.title) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setIsSubmitting(true)
    
    const { data, error } = await supabase.from('infrastructure_issues').insert({
      school_id: formData.school_id,
      category: formData.category,
      title: formData.title,
      description: formData.description || null,
      priority: formData.priority,
      status: 'pending',
      reported_date: new Date().toISOString(),
    }).select()
    
    if (error) {
      console.error('Error submitting report:', error)
      toast.error(`Failed to submit report: ${error.message}`)
      setIsSubmitting(false)
      return
    }
    
    toast.success('Infrastructure issue reported successfully!')
    setIsSubmitting(false)
    resetForm()
    router.push('/dashboard/infrastructure/track')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Report Infrastructure Issue</h1>
          <p className="text-muted-foreground">
            Report shortages, damages, or required repairs
          </p>
        </div>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-10 w-10 text-orange-500" />
              <div>
                <h3 className="font-medium">No Schools Found</h3>
                <p className="text-sm text-muted-foreground">
                  Add schools first before reporting infrastructure issues.
                </p>
                <Button asChild className="mt-2" size="sm">
                  <Link href="/dashboard/settings">Go to Settings</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Report Infrastructure Issue</h1>
        <p className="text-muted-foreground">
          Report shortages, damages, or required repairs
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
              <CardDescription>
                Provide complete information about the infrastructure issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>School *</Label>
                    <Select 
                      value={formData.school_id} 
                      onValueChange={(v) => setFormData({...formData, school_id: v})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select school" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select 
                      value={formData.category}
                      onValueChange={(v) => setFormData({...formData, category: v})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center gap-2">
                              <cat.icon className="h-4 w-4" />
                              <span>{cat.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input 
                    id="title" 
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select 
                    value={formData.priority}
                    onValueChange={(v) => setFormData({...formData, priority: v})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait</SelectItem>
                      <SelectItem value="medium">Medium - Needs attention</SelectItem>
                      <SelectItem value="high">High - Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide detailed information about the issue..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard/infrastructure">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reporting Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="rounded-full bg-orange-100 p-1 h-6 w-6 flex items-center justify-center text-orange-600 font-medium text-xs">1</div>
                <p className="text-muted-foreground">Select the correct category for faster processing</p>
              </div>
              <div className="flex gap-3">
                <div className="rounded-full bg-orange-100 p-1 h-6 w-6 flex items-center justify-center text-orange-600 font-medium text-xs">2</div>
                <p className="text-muted-foreground">Provide accurate location details</p>
              </div>
              <div className="flex gap-3">
                <div className="rounded-full bg-orange-100 p-1 h-6 w-6 flex items-center justify-center text-orange-600 font-medium text-xs">3</div>
                <p className="text-muted-foreground">Mention any safety concerns immediately</p>
              </div>
              <div className="flex gap-3">
                <div className="rounded-full bg-orange-100 p-1 h-6 w-6 flex items-center justify-center text-orange-600 font-medium text-xs">4</div>
                <p className="text-muted-foreground">Track your request status after submission</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Priority Levels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-400" />
                <span><strong>Low:</strong> Non-urgent issues</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span><strong>Medium:</strong> Affects daily activities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span><strong>High:</strong> Urgent attention needed</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
