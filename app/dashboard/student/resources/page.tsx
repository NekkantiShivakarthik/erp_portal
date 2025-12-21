"use client"

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
import { useLanguage } from "@/lib/i18n/language-context"

const resources = [
  {
    id: 1,
    title: "NCERT Mathematics Class 10",
    type: "PDF",
    category: "Study Material",
    subject: "Mathematics",
    size: "2.5 MB",
    icon: FileText,
    color: "blue",
    url: "https://ncert.nic.in/textbook.php",
    description: "Complete NCERT textbook for Class 10 Mathematics"
  },
  {
    id: 2,
    title: "Science Lab Manual",
    type: "PDF",
    category: "Practical",
    subject: "Science",
    size: "5.1 MB",
    icon: BookOpen,
    color: "green",
    url: "https://ncert.nic.in/",
    description: "NCERT Science practical experiments guide"
  },
  {
    id: 3,
    title: "Khan Academy - English Grammar",
    type: "Video",
    category: "Video Lesson",
    subject: "English",
    duration: "45 min",
    icon: Video,
    color: "purple",
    url: "https://www.khanacademy.org/humanities/grammar",
    description: "Free video lessons on English grammar fundamentals"
  },
  {
    id: 4,
    title: "NCERT Social Studies Class 10",
    type: "PDF",
    category: "Study Material",
    subject: "Social Studies",
    size: "3.2 MB",
    icon: FileText,
    color: "orange",
    url: "https://ncert.nic.in/textbook.php",
    description: "History, Geography, Civics and Economics textbooks"
  },
  {
    id: 5,
    title: "Mathematics Practice Questions",
    type: "PDF",
    category: "Practice Test",
    subject: "Mathematics",
    size: "1.8 MB",
    icon: FileText,
    color: "blue",
    url: "https://ncert.nic.in/exemplar-problems.php",
    description: "NCERT Exemplar problems with solutions"
  },
  {
    id: 6,
    title: "Khan Academy - Physics",
    type: "Video",
    category: "Video Lesson",
    subject: "Science",
    duration: "30 min",
    icon: Video,
    color: "green",
    url: "https://www.khanacademy.org/science/physics",
    description: "Free physics video lessons and tutorials"
  },
  {
    id: 7,
    title: "English Literature Notes",
    type: "PDF",
    category: "Study Material",
    subject: "English",
    size: "1.2 MB",
    icon: FileText,
    color: "purple",
    url: "https://ncert.nic.in/textbook.php",
    description: "Chapter-wise summary and analysis"
  },
  {
    id: 8,
    title: "Biology Video Lessons",
    type: "Video",
    category: "Video Lesson",
    subject: "Science",
    duration: "50 min",
    icon: Video,
    color: "green",
    url: "https://www.khanacademy.org/science/biology",
    description: "Cell biology, genetics, and human anatomy"
  },
  {
    id: 9,
    title: "History Sample Papers",
    type: "PDF",
    category: "Practice Test",
    subject: "Social Studies",
    size: "2.1 MB",
    icon: FileText,
    color: "orange",
    url: "https://cbseacademic.nic.in/",
    description: "Previous year questions and sample papers"
  },
  {
    id: 10,
    title: "Chemistry Tutorials",
    type: "Video",
    category: "Video Lesson",
    subject: "Science",
    duration: "40 min",
    icon: Video,
    color: "green",
    url: "https://www.khanacademy.org/science/chemistry",
    description: "Chemical reactions, equations, and periodic table"
  },
  {
    id: 11,
    title: "Mathematics Formula Sheet",
    type: "PDF",
    category: "Study Material",
    subject: "Mathematics",
    size: "0.8 MB",
    icon: FileText,
    color: "blue",
    url: "https://ncert.nic.in/",
    description: "All important formulas for quick revision"
  },
  {
    id: 12,
    title: "Geography Interactive Maps",
    type: "Video",
    category: "Study Material",
    subject: "Social Studies",
    duration: "35 min",
    icon: Video,
    color: "orange",
    url: "https://www.khanacademy.org/humanities/geography",
    description: "World geography with interactive content"
  }
]

export default function StudentResourcesPage() {
  const { t } = useLanguage()
  
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
        <h1 className="text-2xl font-bold">{t('resources.title')}</h1>
        <p className="text-muted-foreground">
          {t('resources.description')}
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t('resources.searchPlaceholder')} 
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {t('resources.filter')}
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
                <p className="font-semibold">{t('resources.studyMaterials')}</p>
                <p className="text-sm text-muted-foreground">{resources.filter(r => r.category === 'Study Material').length} {t('resources.resources')}</p>
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
                <p className="font-semibold">{t('resources.videoLessons')}</p>
                <p className="text-sm text-muted-foreground">{resources.filter(r => r.category === 'Video Lesson').length} {t('resources.videos')}</p>
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
                <p className="font-semibold">{t('resources.practiceTests')}</p>
                <p className="text-sm text-muted-foreground">{resources.filter(r => r.category === 'Practice Test').length} {t('resources.tests')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t('resources.allResources')}</h2>
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
                          {resource.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {resource.type === 'Video' ? (
                        <Button size="sm" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {t('resources.watch')}
                          </a>
                        </Button>
                      ) : (
                        <Button size="sm" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            {t('resources.download')}
                          </a>
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
          <CardTitle>{t('resources.needHelp')}</CardTitle>
          <CardDescription>
            {t('resources.helpDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            {t('resources.contactTeacherButton')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
