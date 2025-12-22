"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { 
  AlertTriangle, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  BookOpen,
  Users,
  Lightbulb,
  Monitor,
  Loader2,
  Pencil,
  Trash2
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Challenge {
  id: string
  title: string
  description: string | null
  category: string | null
  status: string | null
  priority: string | null
  responses: number | null
  created_at: string | null
  class_id: string | null
  classes?: { name: string; section: string | null } | null
}

const categoryIcons: Record<string, React.ElementType> = {
  Academic: BookOpen,
  Attendance: Users,
  Resources: Lightbulb,
  Discipline: AlertTriangle,
  Technology: Monitor,
  Other: AlertTriangle,
}

export default function ChallengesPage() {
  const supabase = createClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    class_id: '',
    priority: 'medium',
  })
  const { t } = useLanguage()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [challengesRes, classesRes] = await Promise.all([
      supabase.from('classroom_challenges').select('*, classes(name, section)').order('created_at', { ascending: false }),
      supabase.from('classes').select('*')
    ])
    setChallenges(challengesRes.data || [])
    setClasses(classesRes.data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      class_id: '',
      priority: 'medium',
    })
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.category) {
      toast.error('Please fill in required fields')
      return
    }
    
    setIsSubmitting(true)
    
    const { error } = await supabase.from('classroom_challenges').insert({
      title: formData.title,
      description: formData.description || null,
      category: formData.category,
      class_id: formData.class_id || null,
      priority: formData.priority,
      status: 'open',
    })
    
    if (error) {
      toast.error('Failed to submit challenge')
      console.error(error)
    } else {
      toast.success('Challenge reported successfully')
      setIsDialogOpen(false)
      resetForm()
      loadData()
    }
    
    setIsSubmitting(false)
  }

  const handleEdit = async () => {
    if (!selectedChallenge || !formData.title || !formData.category) {
      toast.error('Please fill in required fields')
      return
    }
    
    setIsSubmitting(true)
    
    const { error } = await supabase.from('classroom_challenges')
      .update({
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        class_id: formData.class_id || null,
        priority: formData.priority,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedChallenge.id)
    
    if (error) {
      toast.error('Failed to update challenge')
      console.error(error)
    } else {
      toast.success('Challenge updated successfully')
      setIsEditDialogOpen(false)
      setSelectedChallenge(null)
      resetForm()
      loadData()
    }
    
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    if (!selectedChallenge) return
    
    setIsSubmitting(true)
    
    const { error } = await supabase.from('classroom_challenges')
      .delete()
      .eq('id', selectedChallenge.id)
    
    if (error) {
      toast.error('Failed to delete challenge')
      console.error(error)
    } else {
      toast.success('Challenge deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedChallenge(null)
      loadData()
    }
    
    setIsSubmitting(false)
  }

  const openEditDialog = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setFormData({
      title: challenge.title,
      description: challenge.description || '',
      category: challenge.category || '',
      class_id: challenge.class_id || '',
      priority: challenge.priority || 'medium',
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setIsDeleteDialogOpen(true)
  }

  const stats = {
    total: challenges.length,
    open: challenges.filter(c => c.status === 'open').length,
    inProgress: challenges.filter(c => c.status === 'in-progress').length,
    resolved: challenges.filter(c => c.status === 'resolved').length,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('challengesPage.title')}</h1>
          <p className="text-muted-foreground">
            {t('challengesPage.description')}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              {t('challengesPage.reportNew')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t('challengesPage.reportTitle')}</DialogTitle>
              <DialogDescription>
                {t('challengesPage.reportDesc')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('challengesPage.challengeTitle')} *</Label>
                <Input 
                  id="title" 
                  placeholder={t('challengesPage.titlePlaceholder')}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('challengesPage.category')} *</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('challengesPage.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">{t('challengesPage.academic')}</SelectItem>
                      <SelectItem value="Attendance">{t('challengesPage.attendanceIssue')}</SelectItem>
                      <SelectItem value="Resources">{t('challengesPage.resourcesIssue')}</SelectItem>
                      <SelectItem value="Discipline">{t('challengesPage.discipline')}</SelectItem>
                      <SelectItem value="Technology">{t('challengesPage.technology')}</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('challengesPage.class')}</Label>
                  <Select value={formData.class_id} onValueChange={(v) => setFormData({...formData, class_id: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('challengesPage.selectClass')} />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} {cls.section ? `- ${cls.section}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('challengesPage.priority')}</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('challengesPage.selectPriority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('challengesPage.low')}</SelectItem>
                    <SelectItem value="medium">{t('challengesPage.medium')}</SelectItem>
                    <SelectItem value="high">{t('challengesPage.high')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('challengesPage.detailedDesc')}</Label>
                <Textarea 
                  id="description" 
                  placeholder={t('challengesPage.descPlaceholder')}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  t('challengesPage.submitChallenge')
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) { setSelectedChallenge(null); resetForm(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Challenge</DialogTitle>
            <DialogDescription>
              Update the challenge details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input 
                id="edit-title" 
                placeholder="Enter challenge title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Attendance">Attendance</SelectItem>
                    <SelectItem value="Resources">Resources</SelectItem>
                    <SelectItem value="Discipline">Discipline</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={formData.class_id} onValueChange={(v) => setFormData({...formData, class_id: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} {cls.section ? `- ${cls.section}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                placeholder="Describe the challenge..."
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
                'Update Challenge'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => { setIsDeleteDialogOpen(open); if (!open) setSelectedChallenge(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Challenge</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this challenge? This action cannot be undone.
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">{t('infrastructure.totalIssues')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-sm text-muted-foreground">{t('challengesPage.open')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">{t('challengesPage.inProgress')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">{t('challengesPage.resolved')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenges List */}
      {challenges.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg">No challenges reported yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click the "Report New" button to report your first classroom challenge.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {challenges.map((challenge) => {
            const CategoryIcon = categoryIcons[challenge.category || 'Other'] || AlertTriangle
            const className = challenge.classes ? `${challenge.classes.name}${challenge.classes.section ? ' - ' + challenge.classes.section : ''}` : 'Not specified'
            return (
              <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-3 ${
                      challenge.status === "resolved" 
                        ? "bg-green-100" 
                        : challenge.status === "in-progress"
                        ? "bg-blue-100"
                        : "bg-orange-100"
                    }`}>
                      <CategoryIcon className={`h-5 w-5 ${
                        challenge.status === "resolved" 
                          ? "text-green-600" 
                          : challenge.status === "in-progress"
                          ? "text-blue-600"
                          : "text-orange-600"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {challenge.description || 'No description provided'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              challenge.priority === "high"
                                ? "destructive"
                                : challenge.priority === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {challenge.priority}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              challenge.status === "resolved"
                                ? "border-green-500 text-green-600"
                                : challenge.status === "in-progress"
                                ? "border-blue-500 text-blue-600"
                                : "border-orange-500 text-orange-600"
                            }
                          >
                            {challenge.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{className}</span>
                          <span>•</span>
                          <span>{challenge.category}</span>
                          <span>•</span>
                          <span>{challenge.created_at ? new Date(challenge.created_at).toLocaleDateString() : 'N/A'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {challenge.responses || 0} {t('challengesPage.responses')}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog(challenge)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDeleteDialog(challenge)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
