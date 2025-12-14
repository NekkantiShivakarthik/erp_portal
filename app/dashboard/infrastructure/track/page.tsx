"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Eye,
  Loader2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-yellow-500", icon: Clock },
  approved: { label: "Approved", color: "bg-purple-500", icon: CheckCircle },
  "in-progress": { label: "In Progress", color: "bg-blue-500", icon: AlertTriangle },
  resolved: { label: "Resolved", color: "bg-green-500", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500", icon: XCircle },
}

export default function TrackRequestsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [issues, setIssues] = useState<any[]>([])
  const [filteredIssues, setFilteredIssues] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
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
    
    const { data } = await supabase
      .from('infrastructure_issues')
      .select('*, schools(name)')
      .order('created_at', { ascending: false })

    const issuesData = data || []
    setIssues(issuesData)
    
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
    await supabase.from('infrastructure_issues').update({ 
      status: newStatus,
      resolved_date: newStatus === 'resolved' ? new Date().toISOString() : null
    }).eq('id', id)
    loadData()
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
            <SelectItem value="electrical">Electrical</SelectItem>
            <SelectItem value="plumbing">Plumbing</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="building">Building</SelectItem>
            <SelectItem value="other">Other</SelectItem>
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
                          {new Date(issue.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Select 
                        value={issue.status} 
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
