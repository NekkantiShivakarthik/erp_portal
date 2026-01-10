"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Video, 
  Play,
  Clock,
  Calendar,
  Users,
  Award,
  CheckCircle,
  BookOpen,
  Search,
  PlayCircle,
  Youtube,
  GraduationCap,
  Laptop,
  Brain,
  Heart
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

// Training Video Resources for Teachers
const trainingVideos = [
  // Pedagogy & Teaching Methods
  { 
    id: 1, 
    title: "Introduction to Active Learning Strategies", 
    category: "Teaching Methods", 
    duration: "15:32", 
    views: 12500,
    instructor: "NCERT",
    thumbnail: "🎓",
    videoUrl: "https://www.youtube.com/watch?v=UsDI6hDx5uI",
    description: "Learn how to engage students through active learning techniques"
  },
  { 
    id: 2, 
    title: "Flipped Classroom Approach", 
    category: "Teaching Methods", 
    duration: "18:45", 
    views: 8900,
    instructor: "DIKSHA",
    thumbnail: "🔄",
    videoUrl: "https://www.youtube.com/watch?v=iQWvc6qhTds",
    description: "Transform your teaching with the flipped classroom model"
  },
  { 
    id: 3, 
    title: "Differentiated Instruction Techniques", 
    category: "Teaching Methods", 
    duration: "22:10", 
    views: 7650,
    instructor: "CBSE",
    thumbnail: "🎯",
    videoUrl: "https://www.youtube.com/watch?v=h7-D3gi2lL8",
    description: "Address diverse learning needs in your classroom"
  },
  
  // Digital Tools
  { 
    id: 4, 
    title: "Using Google Classroom Effectively", 
    category: "Digital Tools", 
    duration: "25:00", 
    views: 15200,
    instructor: "Google for Education",
    thumbnail: "💻",
    videoUrl: "https://www.youtube.com/watch?v=pl-tBjAM9g4",
    description: "Master Google Classroom for online teaching"
  },
  { 
    id: 5, 
    title: "Creating Interactive Presentations", 
    category: "Digital Tools", 
    duration: "20:15", 
    views: 11300,
    instructor: "Microsoft Education",
    thumbnail: "📊",
    videoUrl: "https://www.youtube.com/watch?v=JGHRHKSHXdE",
    description: "Make your presentations engaging with interactive elements"
  },
  { 
    id: 6, 
    title: "DIKSHA App Training for Teachers", 
    category: "Digital Tools", 
    duration: "30:00", 
    views: 18500,
    instructor: "DIKSHA Official",
    thumbnail: "📱",
    videoUrl: "https://www.youtube.com/watch?v=Sf3EoVIGBvk",
    description: "Complete guide to using DIKSHA for digital content"
  },
  
  // Student Psychology
  { 
    id: 7, 
    title: "Understanding Child Psychology", 
    category: "Psychology", 
    duration: "28:30", 
    views: 9800,
    instructor: "NCERT",
    thumbnail: "🧠",
    videoUrl: "https://www.youtube.com/watch?v=y5TcOWZj3yM",
    description: "Insights into child development and learning psychology"
  },
  { 
    id: 8, 
    title: "Motivating Students for Better Learning", 
    category: "Psychology", 
    duration: "19:45", 
    views: 14200,
    instructor: "CBSE Training",
    thumbnail: "💪",
    videoUrl: "https://www.youtube.com/watch?v=u5UYRCFMNak",
    description: "Techniques to boost student motivation and engagement"
  },
  { 
    id: 9, 
    title: "Handling Classroom Behavior Issues", 
    category: "Psychology", 
    duration: "24:20", 
    views: 11600,
    instructor: "NCERT",
    thumbnail: "🤝",
    videoUrl: "https://www.youtube.com/watch?v=k5_-Gp8Mnqg",
    description: "Effective strategies for classroom management"
  },
  
  // Assessment
  { 
    id: 10, 
    title: "Formative Assessment Strategies", 
    category: "Assessment", 
    duration: "21:00", 
    views: 8700,
    instructor: "CBSE",
    thumbnail: "📝",
    videoUrl: "https://www.youtube.com/watch?v=FKFmFhWdXxY",
    description: "Implement continuous assessment in your classroom"
  },
  { 
    id: 11, 
    title: "Creating Effective Question Papers", 
    category: "Assessment", 
    duration: "17:30", 
    views: 10500,
    instructor: "NCERT",
    thumbnail: "✍️",
    videoUrl: "https://www.youtube.com/watch?v=Yy38EiXpVUE",
    description: "Design balanced and fair assessments"
  },
  { 
    id: 12, 
    title: "Rubric-Based Evaluation", 
    category: "Assessment", 
    duration: "16:45", 
    views: 6900,
    instructor: "CBSE Training",
    thumbnail: "📋",
    videoUrl: "https://www.youtube.com/watch?v=E3dwmQFnGo4",
    description: "Use rubrics for objective and consistent grading"
  },
  
  // Inclusive Education
  { 
    id: 13, 
    title: "Teaching Students with Learning Disabilities", 
    category: "Inclusive Education", 
    duration: "32:15", 
    views: 7800,
    instructor: "NCERT",
    thumbnail: "♿",
    videoUrl: "https://www.youtube.com/watch?v=LLBZfEL2gds",
    description: "Inclusive strategies for diverse learners"
  },
  { 
    id: 14, 
    title: "Creating an Inclusive Classroom", 
    category: "Inclusive Education", 
    duration: "26:00", 
    views: 9200,
    instructor: "UNICEF",
    thumbnail: "🌈",
    videoUrl: "https://www.youtube.com/watch?v=ydGLli8ZmI8",
    description: "Build an environment where every student can thrive"
  },
  
  // NEP 2020
  { 
    id: 15, 
    title: "Understanding NEP 2020", 
    category: "NEP 2020", 
    duration: "35:00", 
    views: 22000,
    instructor: "Ministry of Education",
    thumbnail: "🇮🇳",
    videoUrl: "https://www.youtube.com/watch?v=MTOKPBg6aV4",
    description: "Complete overview of National Education Policy 2020"
  },
  { 
    id: 16, 
    title: "Competency Based Education under NEP", 
    category: "NEP 2020", 
    duration: "28:45", 
    views: 15600,
    instructor: "NCERT",
    thumbnail: "📚",
    videoUrl: "https://www.youtube.com/watch?v=Q2S9lLPBqpY",
    description: "Implement competency-based learning in your classroom"
  },
]

const videoCategories = ["All", "Teaching Methods", "Digital Tools", "Psychology", "Assessment", "Inclusive Education", "NEP 2020"]

const workshops = [
  {
    id: 1,
    title: "Digital Teaching Methods",
    description: "Learn modern digital tools and techniques for effective classroom teaching",
    date: "Dec 20, 2024",
    time: "10:00 AM - 1:00 PM",
    duration: "3 hours",
    instructor: "Dr. Anand Sharma",
    participants: 45,
    status: "upcoming",
    type: "Live",
  },
  {
    id: 2,
    title: "Student Psychology & Motivation",
    description: "Understanding student behavior and techniques to motivate learners",
    date: "Dec 25, 2024",
    time: "2:00 PM - 5:00 PM",
    duration: "3 hours",
    instructor: "Dr. Meera Gupta",
    participants: 38,
    status: "upcoming",
    type: "Live",
  },
  {
    id: 3,
    title: "Effective Assessment Techniques",
    description: "Modern approaches to student assessment and evaluation",
    date: "Dec 15, 2024",
    time: "10:00 AM - 12:00 PM",
    duration: "2 hours",
    instructor: "Prof. Rakesh Kumar",
    participants: 52,
    status: "completed",
    type: "Recorded",
    certificate: true,
  },
  {
    id: 4,
    title: "Inclusive Education Practices",
    description: "Strategies for teaching students with diverse learning needs",
    date: "Jan 5, 2025",
    time: "11:00 AM - 2:00 PM",
    duration: "3 hours",
    instructor: "Dr. Sunita Patel",
    participants: 30,
    status: "upcoming",
    type: "Live",
  },
]

const completedCourses = [
  {
    title: "Introduction to Smart Classroom",
    completedDate: "Nov 28, 2024",
    score: 92,
    certificate: true,
  },
  {
    title: "Basic Computer Skills for Teachers",
    completedDate: "Nov 15, 2024",
    score: 88,
    certificate: true,
  },
  {
    title: "Child Safety & Protection",
    completedDate: "Oct 30, 2024",
    score: 95,
    certificate: true,
  },
]

export default function TrainingPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedVideo, setSelectedVideo] = useState<typeof trainingVideos[0] | null>(null)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)

  // Filter videos
  const filteredVideos = trainingVideos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle video click
  const handleVideoClick = (video: typeof trainingVideos[0]) => {
    setSelectedVideo(video)
    setVideoDialogOpen(true)
  }

  // Open video in new tab
  const openVideoExternal = () => {
    if (selectedVideo) {
      window.open(selectedVideo.videoUrl, '_blank')
    }
    setVideoDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('trainingPage.title')}</h1>
        <p className="text-muted-foreground">
          {t('trainingPage.description')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-3">
                <Youtube className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{trainingVideos.length}</p>
                <p className="text-sm text-muted-foreground">{t('trainingPage.trainingVideos')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3">
                <Video className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">{t('trainingPage.upcomingWorkshops')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">{t('trainingPage.completed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-100 dark:bg-orange-900/30 p-3">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">{t('trainingPage.duration')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="videos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="videos">Training Videos</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Workshops</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="certificates">My Certificates</TabsTrigger>
        </TabsList>

        {/* Training Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search training videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {videoCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {videoCategories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Videos Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((video) => (
              <Card 
                key={video.id} 
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleVideoClick(video)}
              >
                <CardContent className="pt-6">
                  {/* Thumbnail */}
                  <div className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-lg h-32 flex items-center justify-center mb-4 group-hover:from-red-600 group-hover:to-red-800 transition-all">
                    <span className="text-4xl">{video.thumbnail}</span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="h-12 w-12 text-white" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white text-xs">
                      {video.duration}
                    </Badge>
                  </div>
                  
                  {/* Video Info */}
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                    <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span>{video.instructor}</span>
                      <span>{(video.views / 1000).toFixed(1)}K views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No videos found matching your filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {workshops
            .filter((w) => w.status === "upcoming")
            .map((workshop) => (
              <Card key={workshop.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="rounded-lg bg-red-100 p-4">
                      <Video className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{workshop.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {workshop.description}
                          </p>
                        </div>
                        <Badge className="bg-orange-500">{workshop.type}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {workshop.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {workshop.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {workshop.participants} enrolled
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          By {workshop.instructor}
                        </span>
                      </div>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Play className="h-4 w-4 mr-2" />
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedCourses.map((course, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-green-100 p-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed on {course.completedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-lg font-bold text-green-600">{course.score}%</p>
                    </div>
                    {course.certificate && (
                      <Button variant="outline" size="sm">
                        <Award className="h-4 w-4 mr-2" />
                        Certificate
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedCourses.map((course, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-4 mb-4">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Issued: {course.completedDate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Score: {course.score}%
                    </p>
                    <Button className="mt-4 w-full" variant="outline">
                      Download Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              Watch Training Video
            </DialogTitle>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="space-y-4">
              {/* Video Preview */}
              <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg h-40 flex items-center justify-center">
                <span className="text-6xl">{selectedVideo.thumbnail}</span>
              </div>
              
              {/* Video Details */}
              <div className="space-y-2">
                <Badge variant="outline">{selectedVideo.category}</Badge>
                <h3 className="font-semibold text-lg">{selectedVideo.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedVideo.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedVideo.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {(selectedVideo.views / 1000).toFixed(1)}K views
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {selectedVideo.instructor}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={openVideoExternal}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch on YouTube
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setVideoDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
