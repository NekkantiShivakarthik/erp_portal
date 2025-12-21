"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Wrench,
  AlertCircle
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"

export default function StudentInfrastructurePage() {
  const supabase = createClient()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [issues, setIssues] = useState<any[]>([])
  const [schoolName, setSchoolName] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    
    const school = localStorage.getItem('schoolName')
    const schoolId = localStorage.getItem('schoolId')
    setSchoolName(school || '')

    // For demo student, show demo data
    const studentId = localStorage.getItem('studentId')
    
    if (studentId === 'demo-student-001') {
      // Demo infrastructure issues
      const demoIssues = [
        {
          id: 'demo-issue-1',
          title: 'Broken Ceiling Fan in Classroom 5A',
          description: 'The ceiling fan in classroom 5A is not working properly and makes loud noise.',
          category: 'electrical',
          priority: 'medium',
          status: 'in-progress',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          schools: { name: 'Demo Government School' }
        },
        {
          id: 'demo-issue-2',
          title: 'Leaking Water Tap in Boys Toilet',
          description: 'Water tap in the boys toilet on ground floor is leaking continuously.',
          category: 'plumbing',
          priority: 'high',
          status: 'pending',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          schools: { name: 'Demo Government School' }
        },
        {
          id: 'demo-issue-3',
          title: 'Broken Desk in Library',
          description: 'One of the study desks in the library has a broken leg.',
          category: 'furniture',
          priority: 'low',
          status: 'resolved',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          schools: { name: 'Demo Government School' }
        },
        {
          id: 'demo-issue-4',
          title: 'Flickering Tube Light in Corridor',
          description: 'The tube light in the main corridor keeps flickering.',
          category: 'electrical',
          priority: 'medium',
          status: 'approved',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          schools: { name: 'Demo Government School' }
        },
        {
          id: 'demo-issue-5',
          title: 'Crack in Classroom Wall',
          description: 'There is a visible crack on the wall of classroom 3B.',
          category: 'building',
          priority: 'high',
          status: 'in-progress',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          schools: { name: 'Demo Government School' }
        }
      ]
      
      setIssues(demoIssues)
      setStats({
        total: demoIssues.length,
        pending: demoIssues.filter(i => i.status === 'pending').length,
        inProgress: demoIssues.filter(i => i.status === 'in-progress' || i.status === 'approved').length,
        resolved: demoIssues.filter(i => i.status === 'resolved').length,
      })
      setLoading(false)
      return
    }

    // Fetch real data for actual students
    let query = supabase.from('infrastructure_issues').select('*, schools(name)').order('created_at', { ascending: false })
    
    // If student has a school ID, filter by that school
    if (schoolId) {
      query = query.eq('school_id', schoolId)
    }

    const { data: issuesData } = await query

    const issues = issuesData || []
    setIssues(issues)
    
    setStats({
      total: issues.length,
      pending: issues.filter(i => i.status === 'pending').length,
      inProgress: issues.filter(i => i.status === 'in-progress' || i.status === 'approved').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
    })
    
    setLoading(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electrical': return '⚡'
      case 'plumbing': return '🚰'
      case 'furniture': return '🪑'
      case 'building': return '🏗️'
      default: return '🔧'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'approved': return 'bg-purple-500'
      default: return 'bg-orange-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return t('infrastructure.resolved')
      case 'in-progress': return t('infrastructure.inProgress')
      case 'approved': return t('infrastructure.inProgress')
      case 'pending': return t('infrastructure.pending')
      default: return status
    }
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
          {issues.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{t('infrastructure.noIssues')}</h3>
              <p className="text-muted-foreground">
                {t('infrastructure.greatNews')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-lg border p-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                      <div>
                        <h3 className="font-semibold">{issue.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {issue.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span className="capitalize">{issue.category}</span>
                          <span>•</span>
                          <span>{new Date(issue.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        variant={issue.priority === 'high' ? 'destructive' : issue.priority === 'medium' ? 'default' : 'secondary'}
                      >
                        {issue.priority} {t('infrastructure.priority')}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={`${getStatusColor(issue.status)} text-white border-0`}
                      >
                        {getStatusLabel(issue.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
