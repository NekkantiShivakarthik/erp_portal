"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Building2, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Wrench,
  AlertCircle,
  Search,
  Calendar,
  Droplets,
  Lightbulb,
  Armchair
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-yellow-500", icon: Clock },
  approved: { label: "Approved", color: "bg-purple-500", icon: CheckCircle },
  "in-progress": { label: "In Progress", color: "bg-blue-500", icon: Wrench },
  resolved: { label: "Resolved", color: "bg-green-500", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500", icon: AlertTriangle },
}

const categoryIcons: Record<string, string> = {
  'Electricity': '⚡',
  'Plumbing': '🚰',
  'Furniture': '🪑',
  'Classroom': '🏫',
  'Toilet': '🚽',
  'Other': '🔧',
}

export default function StudentInfrastructurePage() {
  const supabase = createClient()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [issues, setIssues] = useState<any[]>([])
  const [filteredIssues, setFilteredIssues] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterIssues()
  }, [issues, searchTerm, statusFilter, categoryFilter])

  const loadData = async () => {
    setLoading(true)
    
    try {
      // Fetch all infrastructure issues from database
      const { data: issuesData, error } = await supabase
        .from('infrastructure_issues')
        .select('*, schools(name)')
        .order('created_at', { ascending: false })

      if (error) {
        // Log error details for debugging
        console.warn('Could not load infrastructure issues from database:', error.message || 'Unknown error')
        // Continue with empty array - table might not exist yet
      }

      const issues = issuesData || []
      setIssues(issues)
      
      setStats({
        total: issues.length,
        pending: issues.filter(i => i.status === 'pending').length,
        inProgress: issues.filter(i => i.status === 'in-progress' || i.status === 'approved').length,
        resolved: issues.filter(i => i.status === 'resolved').length,
      })
    } catch (err) {
      console.warn('Infrastructure issues fetch failed:', err)
      // Set empty state on error
      setIssues([])
      setStats({ total: 0, pending: 0, inProgress: 0, resolved: 0 })
    }
    
    setLoading(false)
  }

  const filterIssues = () => {
    let filtered = [...issues]
    
    if (searchTerm) {
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || '🔧'
  }

  const getStatusInfo = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
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
        <h1 className="text-2xl font-bold">{t('infrastructure.title')}</h1>
        <p className="text-muted-foreground">
          {t('infrastructure.viewIssues')}
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              {t('infrastructure.infoMessage')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('infrastructure.totalIssues')}</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{t('infrastructure.allReported')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('infrastructure.pending')}</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">{t('infrastructure.awaitingAction')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('infrastructure.inProgress')}</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">{t('infrastructure.beingFixed')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('infrastructure.resolved')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">{t('infrastructure.completed')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title or description..." 
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

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t('infrastructure.infrastructureIssues')}
          </CardTitle>
          <CardDescription>
            {t('infrastructure.currentAndPast')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{t('infrastructure.noIssues')}</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                  ? 'No issues match your filters.' 
                  : t('infrastructure.greatNews')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue) => {
                const statusInfo = getStatusInfo(issue.status)
                return (
                  <div
                    key={issue.id}
                    className="rounded-lg border p-4 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                        <div>
                          <h3 className="font-semibold">{issue.title}</h3>
                          {issue.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {issue.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{issue.category}</span>
                            <span>•</span>
                            <span>{(issue.schools as any)?.name || 'School'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {issue.created_at ? new Date(issue.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant={issue.priority === 'high' ? 'destructive' : issue.priority === 'medium' ? 'default' : 'secondary'}
                        >
                          {issue.priority} priority
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={`${statusInfo.color} text-white border-0`}
                        >
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
