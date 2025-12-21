"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  Monitor
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

const challenges = [
  {
    id: 1,
    title: "Students struggling with Algebra concepts",
    category: "Academic",
    class: "Class 9A",
    status: "in-progress",
    priority: "high",
    date: "Dec 10, 2024",
    description: "Many students in Class 9A are having difficulty understanding linear equations and quadratic formulas.",
    responses: 2,
  },
  {
    id: 2,
    title: "Low attendance in morning classes",
    category: "Attendance",
    class: "Class 8B",
    status: "open",
    priority: "medium",
    date: "Dec 8, 2024",
    description: "Several students regularly arrive late to the first period, affecting overall class progress.",
    responses: 1,
  },
  {
    id: 3,
    title: "Need additional science lab equipment",
    category: "Resources",
    class: "Class 10A",
    status: "resolved",
    priority: "medium",
    date: "Dec 5, 2024",
    description: "Current lab equipment is insufficient for practical demonstrations for the entire class.",
    responses: 3,
  },
  {
    id: 4,
    title: "Students distracted by mobile phones",
    category: "Discipline",
    class: "Class 10B",
    status: "open",
    priority: "high",
    date: "Dec 12, 2024",
    description: "Despite rules, some students continue to use mobile phones during class time.",
    responses: 0,
  },
]

const categoryIcons: Record<string, React.ElementType> = {
  Academic: BookOpen,
  Attendance: Users,
  Resources: Lightbulb,
  Discipline: AlertTriangle,
  Technology: Monitor,
}

export default function ChallengesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { t } = useLanguage()

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Label htmlFor="title">{t('challengesPage.challengeTitle')}</Label>
                <Input id="title" placeholder={t('challengesPage.titlePlaceholder')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('challengesPage.category')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('challengesPage.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">{t('challengesPage.academic')}</SelectItem>
                      <SelectItem value="attendance">{t('challengesPage.attendanceIssue')}</SelectItem>
                      <SelectItem value="resources">{t('challengesPage.resourcesIssue')}</SelectItem>
                      <SelectItem value="discipline">{t('challengesPage.discipline')}</SelectItem>
                      <SelectItem value="technology">{t('challengesPage.technology')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('challengesPage.class')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('challengesPage.selectClass')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8b">Class 8B</SelectItem>
                      <SelectItem value="9a">Class 9A</SelectItem>
                      <SelectItem value="10a">Class 10A</SelectItem>
                      <SelectItem value="10b">Class 10B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('challengesPage.priority')}</Label>
                <Select>
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
                />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                {t('challengesPage.submitChallenge')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
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
                <p className="text-2xl font-bold">2</p>
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
                <p className="text-2xl font-bold">1</p>
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
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">{t('challengesPage.resolved')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenges List */}
      <div className="grid gap-4">
        {challenges.map((challenge) => {
          const CategoryIcon = categoryIcons[challenge.category] || AlertTriangle
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
                          {challenge.description}
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
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span>{challenge.class}</span>
                      <span>•</span>
                      <span>{challenge.category}</span>
                      <span>•</span>
                      <span>{challenge.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {challenge.responses} {t('challengesPage.responses')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
