"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  Search,
  Filter
} from "lucide-react"

const resources = [
  {
    id: 1,
    title: "Mathematics - Class 10",
    type: "PDF",
    category: "Study Material",
    subject: "Mathematics",
    size: "2.5 MB",
    icon: FileText,
    color: "blue"
  },
  {
    id: 2,
    title: "Science Experiments Guide",
    type: "PDF",
    category: "Practical",
    subject: "Science",
    size: "5.1 MB",
    icon: BookOpen,
    color: "green"
  },
  {
    id: 3,
    title: "English Grammar Lessons",
    type: "Video",
    category: "Video Lesson",
    subject: "English",
    duration: "45 min",
    icon: Video,
    color: "purple"
  },
  {
    id: 4,
    title: "Social Studies Notes",
    type: "PDF",
    category: "Study Material",
    subject: "Social Studies",
    size: "3.2 MB",
    icon: FileText,
    color: "orange"
  },
  {
    id: 5,
    title: "Mathematics Practice Problems",
    type: "PDF",
    category: "Practice Test",
    subject: "Mathematics",
    size: "1.8 MB",
    icon: FileText,
    color: "blue"
  },
  {
    id: 6,
    title: "Physics Concepts Video",
    type: "Video",
    category: "Video Lesson",
    subject: "Science",
    duration: "30 min",
    icon: Video,
    color: "green"
  }
]

export default function StudentResourcesPage() {
  const t = useTranslations()

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string, text: string, border: string }> = {
      blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
      green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
      purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
      orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Learning Resources</h1>
        <p className="text-muted-foreground">
          Access study materials, videos, and practice tests
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search resources..." 
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resource Categories */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Study Materials</p>
                <p className="text-sm text-muted-foreground">12 Resources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Video className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Video Lessons</p>
                <p className="text-sm text-muted-foreground">8 Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold">Practice Tests</p>
                <p className="text-sm text-muted-foreground">15 Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Resources</h2>
        <div className="grid gap-4">
          {resources.map((resource) => {
            const colors = getColorClasses(resource.color)
            const Icon = resource.icon
            
            return (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`h-12 w-12 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{resource.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {resource.subject}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {resource.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {resource.type === 'Video' ? resource.duration : resource.size}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {resource.type === 'Video' 
                            ? 'Educational video content to help you learn better'
                            : 'Comprehensive study material and practice questions'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {resource.type === 'Video' ? (
                        <Button size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Watch
                        </Button>
                      ) : (
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Contact your teacher if you need additional resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            Contact Teacher
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
