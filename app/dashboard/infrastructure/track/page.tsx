"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Eye,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  Building2,
  Droplets,
  Lightbulb,
  Armchair
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-yellow-500", icon: Clock },
  approved: { label: "Approved", color: "bg-purple-500", icon: CheckCircle },
  "in-progress": { label: "In Progress", color: "bg-blue-500", icon: AlertTriangle },
  resolved: { label: "Resolved", color: "bg-green-500", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500", icon: XCircle },
}

const categories = [
  { value: "Classroom", label: "Classroom/Building", icon: Building2 },
  { value: "Plumbing", label: "Plumbing/Sanitation", icon: Droplets },
  { value: "Electricity", label: "Electrical", icon: Lightbulb },
  { value: "Furniture", label: "Furniture", icon: Armchair },
  { value: "Toilet", label: "Toilet", icon: Droplets },
  { value: "Other", label: "Other", icon: AlertTriangle },
]

interface Issue {
  id: string
  school_id: string | null
  title: string
  description: string | null
  category: string | null
  status: string | null
  priority: string | null
  created_at: string | null
  schools?: { name: string } | null
}

export default function TrackRequestsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [issues, setIssues] = useState<Issue[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    school_id: '',
    category: '',
    title: '',
    description: '',
    priority: 'medium',
  })
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    'in-progress': 0,
    resolved: 0,
    rejected: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterIssues()
  }, [issues, searchTerm, statusFilter, categoryFilter])

  const loadData = async () => {
    setLoading(true)
    
    const [issuesRes, schoolsRes] = await Promise.all([
      supabase
        .from('infrastructure_issues')
        .select('*, schools(name)')
        .order('created_at', { ascending: false }),
      supabase.from('schools').select('*')
    ])

    const issuesData = issuesRes.data || []
    setIssues(issuesData)
    setSchools(schoolsRes.data || [])
    
    setStats({
      pending: issuesData.filter(i => i.status === 'pending').length,
      approved: issuesData.filter(i => i.status === 'approved').length,
      'in-progress': issuesData.filter(i => i.status === 'in-progress').length,
      resolved: issuesData.filter(i => i.status === 'resolved').length,
      rejected: issuesData.filter(i => i.status === 'rejected').length,
    })
    
    setLoading(false)
  }

  const filterIssues = () => {
    let filtered = [...issues]
    
    if (searchTerm) {
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter)
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(i => i.category === categoryFilter)
    }
    
    setFilteredIssues(filtered)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('infrastructure_issues').update({ 
      status: newStatus,
      resolved_date: newStatus === 'resolved' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }).eq('id', id)
    
    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success('Status updated successfully')
      loadData()
    }
  }

  const openEditDialog = (issue: Issue) => {
    setSelectedIssue(issue)
    setFormData({
      school_id: issue.school_id || '',
      category: issue.category || '',
      title: issue.title,
      description: issue.description || '',
      priority: issue.priority || 'medium',
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (issue: Issue) => {
    setSelectedIssue(issue)
    setIsDeleteDialogOpen(true)
  }

  const handleEdit = async () => {
    if (!selectedIssue || !formData.title || !formData.category) {
      toast.error('Please fill in required fields')
      return
    }
    
    setIsSubmitting(true)
    
    const { error } = await supabase.from('infrastructure_issues')
      .update({
        school_id: formData.school_id || null,
        category: formData.category,
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedIssue.id)
    
    if (error) {
      toast.error('Failed to update issue')
      console.error(error)
    } else {
      toast.success('Issue updated successfully')
      setIsEditDialogOpen(false)
      setSelectedIssue(null)
      loadData()
    }
    
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    if (!selectedIssue) return
    
    setIsSubmitting(true)
    
    const { error } = await supabase.from('infrastructure_issues')
      .delete()
      .eq('id', selectedIssue.id)
    
    if (error) {
      toast.error('Failed to delete issue')
      console.error(error)
    } else {
      toast.success('Issue deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedIssue(null)
      loadData()
    }
    
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) setSelectedIssue(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Infrastructure Issue</DialogTitle>
            <DialogDescription>
              Update the issue details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>School *</Label>
              <Select value={formData.school_id} onValueChange={(v) => setFormData({...formData, school_id: v})}>
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
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-title">Issue Title *</Label>
              <Input 
                id="edit-title" 
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                placeholder="Detailed description..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleEdit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Issue'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => { setIsDeleteDialogOpen(open); if (!open) setSelectedIssue(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Infrastructure Issue</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this issue? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Track Infrastructure Requests</h1>
        <p className="text-muted-foreground">
          Monitor the status of reported infrastructure issues
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Electricity">Electrical</SelectItem>
            <SelectItem value="Plumbing">Plumbing</SelectItem>
            <SelectItem value="Furniture">Furniture</SelectItem>
            <SelectItem value="Classroom">Classroom</SelectItem>
            <SelectItem value="Toilet">Toilet</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = stats[key as keyof typeof stats]
          return (
            <Card key={key}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                  <div className={`rounded-lg p-2 ${config.color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
                    <config.icon className={`h-4 w-4 ${config.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Requests List */}
      {filteredIssues.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No infrastructure issues found.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/infrastructure">Report an Issue</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => {
            const statusInfo = statusConfig[issue.status as keyof typeof statusConfig] || statusConfig.pending
            return (
              <Card key={issue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                            <Badge
                              variant={
                                issue.priority === "high"
                                  ? "destructive"
                                  : issue.priority === "medium"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {issue.priority}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{issue.title}</h3>
                        </div>
                      </div>
                      {issue.description && (
                        <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>{issue.category}</span>
                        <span>•</span>
                        <span>{(issue.schools as any)?.name || 'School'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {issue.created_at ? new Date(issue.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Select 
                        value={issue.status || 'pending'} 
                        onValueChange={(v) => handleStatusChange(issue.id, v)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => openEditDialog(issue)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 text-destructive hover:text-destructive"
                          onClick={() => openDeleteDialog(issue)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
