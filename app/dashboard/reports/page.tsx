"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Download,
  Calendar,
  BarChart3,
  Users,
  Building2,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react"

const reportTypes = [
  {
    id: "attendance",
    title: "Attendance Report",
    description: "Daily, weekly, and monthly attendance statistics",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    lastGenerated: "Dec 12, 2024",
    frequency: "Daily",
  },
  {
    id: "infrastructure",
    title: "Infrastructure Report",
    description: "Status of facilities, pending repairs, and resource needs",
    icon: Building2,
    color: "bg-orange-100 text-orange-600",
    lastGenerated: "Dec 10, 2024",
    frequency: "Weekly",
  },
  {
    id: "fund-utilization",
    title: "Fund Utilization Report",
    description: "Detailed breakdown of fund allocation and spending",
    icon: Wallet,
    color: "bg-green-100 text-green-600",
    lastGenerated: "Dec 1, 2024",
    frequency: "Monthly",
  },
  {
    id: "academic-progress",
    title: "Academic Progress Report",
    description: "Student performance and learning outcomes",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-600",
    lastGenerated: "Nov 30, 2024",
    frequency: "Quarterly",
  },
  {
    id: "teacher-activity",
    title: "Teacher Activity Report",
    description: "Teaching hours, training completion, and resource usage",
    icon: Users,
    color: "bg-cyan-100 text-cyan-600",
    lastGenerated: "Dec 5, 2024",
    frequency: "Weekly",
  },
  {
    id: "comprehensive",
    title: "Comprehensive School Report",
    description: "Complete overview of all school metrics and activities",
    icon: BarChart3,
    color: "bg-red-100 text-red-600",
    lastGenerated: "Nov 30, 2024",
    frequency: "Monthly",
  },
]

const generatedReports = [
  {
    title: "Monthly Attendance Report - November 2024",
    type: "Attendance",
    generatedOn: "Dec 1, 2024",
    generatedBy: "System",
    size: "2.4 MB",
    format: "PDF",
  },
  {
    title: "Infrastructure Status Report - Week 49",
    type: "Infrastructure",
    generatedOn: "Dec 10, 2024",
    generatedBy: "Rajesh Kumar",
    size: "1.8 MB",
    format: "PDF",
  },
  {
    title: "Fund Utilization Statement - Q3 2024",
    type: "Financial",
    generatedOn: "Oct 15, 2024",
    generatedBy: "System",
    size: "3.2 MB",
    format: "Excel",
  },
  {
    title: "Teacher Training Completion Report",
    type: "Training",
    generatedOn: "Nov 28, 2024",
    generatedBy: "Admin",
    size: "1.1 MB",
    format: "PDF",
  },
]

const scheduledReports = [
  {
    title: "Daily Attendance Summary",
    schedule: "Every day at 6:00 PM",
    nextRun: "Dec 13, 2024",
    status: "active",
  },
  {
    title: "Weekly Infrastructure Review",
    schedule: "Every Monday at 9:00 AM",
    nextRun: "Dec 16, 2024",
    status: "active",
  },
  {
    title: "Monthly Financial Statement",
    schedule: "1st of every month",
    nextRun: "Jan 1, 2025",
    status: "active",
  },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate, view, and download various school reports
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-3 ${report.color}`}>
                  <report.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline">{report.frequency}</Badge>
              </div>
              <CardTitle className="text-base mt-3">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last: {report.lastGenerated}
                </span>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recently Generated Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Generated Reports</CardTitle>
            <CardDescription>Download your previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedReports.map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{report.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.type} • {report.size} • {report.generatedOn}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    {report.format}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Auto-generated reports on schedule</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                Add Schedule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledReports.map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{report.title}</p>
                      <p className="text-xs text-muted-foreground">{report.schedule}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Next: {report.nextRun}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats for Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Report Statistics</CardTitle>
          <CardDescription>Overview of report generation and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-blue-600">42</p>
              <p className="text-sm text-muted-foreground">Reports Generated</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-green-600">156</p>
              <p className="text-sm text-muted-foreground">Downloads</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-orange-600">8</p>
              <p className="text-sm text-muted-foreground">Active Schedules</p>
              <p className="text-xs text-muted-foreground">Auto-reports</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-purple-600">98%</p>
              <p className="text-sm text-muted-foreground">Compliance Rate</p>
              <p className="text-xs text-muted-foreground">Report submissions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
