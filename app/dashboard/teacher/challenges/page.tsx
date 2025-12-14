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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Classroom Challenges</h1>
          <p className="text-muted-foreground">
            Report and track classroom issues for support and resolution
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Report New Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Report a Classroom Challenge</DialogTitle>
              <DialogDescription>
                Describe the issue you're facing. This will be reviewed by school administrators.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Challenge Title</Label>
                <Input id="title" placeholder="Brief description of the issue" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="resources">Resources</SelectItem>
                      <SelectItem value="discipline">Discipline</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
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
                <Label>Priority</Label>
                <Select>
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
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Provide more details about the challenge..."
                  rows={4}
                />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Submit Challenge Report
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
                <p className="text-sm text-muted-foreground">Total Issues</p>
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
                <p className="text-sm text-muted-foreground">Open</p>
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
                <p className="text-sm text-muted-foreground">In Progress</p>
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
                <p className="text-sm text-muted-foreground">Resolved</p>
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
                        {challenge.responses} responses
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
