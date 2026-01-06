"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Building2, 
  Armchair,
  Droplets,
  Lightbulb,
  BookOpen,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Loader2,
  AlertCircle,
  WifiOff
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { getDemoData, DemoDataStore } from "@/lib/demo-data"

export default function InfrastructurePage() {
  const supabase = createClient()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [issues, setIssues] = useState<any[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newIssue, setNewIssue] = useState({
    school_id: '',
    title: '',
    description: '',
    category: '',
    priority: 'medium',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadDemoData = () => {
    const demoStore = getDemoData()
    
    const issuesData = demoStore.infrastructureIssues.map(issue => ({
      ...issue,
      schools: demoStore.schools.find(s => s.id === issue.school_id)
    }))
    
    setIssues(issuesData)
    setSchools(demoStore.schools)
    
    setStats({
      total: issuesData.length,
      pending: issuesData.filter(i => i.status === 'pending').length,
      inProgress: issuesData.filter(i => i.status === 'in-progress').length,
      resolved: issuesData.filter(i => i.status === 'resolved').length,
    })
    
    setIsOfflineMode(true)
  }

  const loadData = async () => {
    setLoading(true)
    
    try {
      const [issuesRes, schoolsRes] = await Promise.all([
        supabase.from('infrastructure_issues').select('*, schools(name)').order('created_at', { ascending: false }),
        supabase.from('schools').select('*'),
      ])

      if (issuesRes.error || schoolsRes.error) {
        loadDemoData()
        setLoading(false)
        return
      }

      const issuesData = issuesRes.data || []
      setIssues(issuesData)
      setSchools(schoolsRes.data || [])
      
      setStats({
        total: issuesData.length,
        pending: issuesData.filter(i => i.status === 'pending').length,
        inProgress: issuesData.filter(i => i.status === 'in-progress' || i.status === 'approved').length,
        resolved: issuesData.filter(i => i.status === 'resolved').length,
      })
    } catch (error) {
      loadDemoData()
    }
    
    setLoading(false)
  }

  const handleCreateIssue = async () => {
    if (!newIssue.school_id || !newIssue.title || !newIssue.category) return

    if (isOfflineMode) {
      const demoStore = DemoDataStore.getInstance()
      demoStore.addInfrastructureIssue({
        school_id: newIssue.school_id,
        title: newIssue.title,
        description: newIssue.description,
        category: newIssue.category,
        priority: newIssue.priority as 'low' | 'medium' | 'high',
        status: 'pending',
        reported_by: 'current-user',
      })
    } else {
      await supabase.from('infrastructure_issues').insert({
        school_id: newIssue.school_id,
        title: newIssue.title,
        description: newIssue.description,
        category: newIssue.category,
        priority: newIssue.priority,
        status: 'pending',
      })
    }

    setNewIssue({ school_id: '', title: '', description: '', category: '', priority: 'medium' })
    setDialogOpen(false)
    loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const hasNoData = schools.length === 0

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isOfflineMode && (
        <Card className="border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-600">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <WifiOff className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-800 dark:text-amber-300">Demo Mode</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Showing demo infrastructure data. New issues will be saved locally.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('sidebar.infrastructureStatus')}</h1>
          <p className="text-muted-foreground">
            {t('infrastructure.manageInfrastructure')}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600" disabled={hasNoData}>
              <Plus className="h-4 w-4 mr-2" />
              {t('infrastructure.reportIssue')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('infrastructure.reportIssue')}</DialogTitle>
              <DialogDescription>{t('infrastructure.description')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t('common.school')}</Label>
                <Select value={newIssue.school_id} onValueChange={(v) => setNewIssue({...newIssue, school_id: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('reports.selectSchool')} />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('challengesPage.challengeTitle')}</Label>
                <Input 
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                  placeholder={t('challengesPage.titlePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('infrastructure.category')}</Label>
                <Select value={newIssue.category} onValueChange={(v) => setNewIssue({...newIssue, category: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('challengesPage.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">{t('infrastructure.electrical')}</SelectItem>
                    <SelectItem value="plumbing">{t('infrastructure.plumbing')}</SelectItem>
                    <SelectItem value="furniture">{t('infrastructure.furniture')}</SelectItem>
                    <SelectItem value="building">{t('infrastructure.building')}</SelectItem>
                    <SelectItem value="other">{t('infrastructure.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('infrastructure.priority')}</Label>
                <Select value={newIssue.priority} onValueChange={(v) => setNewIssue({...newIssue, priority: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('infrastructure.lowPriority')}</SelectItem>
                    <SelectItem value="medium">{t('infrastructure.mediumPriority')}</SelectItem>
                    <SelectItem value="high">{t('infrastructure.highPriority')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('infrastructure.description')}</Label>
                <Textarea 
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  placeholder={t('challengesPage.descPlaceholder')}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('settingsPage.cancel')}</Button>
              <Button onClick={handleCreateIssue}>{t('infrastructure.submitReport')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {hasNoData && (
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
      )}

      {/* Infrastructure Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Issues</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All reported issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being addressed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Issues</CardTitle>
            <CardDescription>Latest infrastructure problems reported</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/infrastructure/track">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No infrastructure issues reported yet.
            </p>
          ) : (
            <div className="space-y-4">
              {issues.slice(0, 5).map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      issue.status === "resolved" 
                        ? "bg-green-500" 
                        : issue.status === "in-progress"
                        ? "bg-blue-500"
                        : issue.status === "approved"
                        ? "bg-purple-500"
                        : "bg-orange-500"
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{issue.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {issue.category} • {(issue.schools as any)?.name || 'School'} • {new Date(issue.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      issue.priority === "high" ? "destructive" :
                      issue.priority === "medium" ? "default" : "secondary"
                    }>
                      {issue.priority}
                    </Badge>
                    <Badge
                      variant={
                        issue.status === "resolved"
                          ? "default"
                          : issue.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                      className={issue.status === "resolved" ? "bg-green-500" : ""}
                    >
                      {issue.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Infrastructure Health</CardTitle>
          <CardDescription>Summary of school infrastructure condition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="rounded-lg bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Issues Resolved</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">Under Repair</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
