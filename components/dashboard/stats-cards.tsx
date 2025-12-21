"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function StatsCards() {
  const { t } = useLanguage()

  const stats = [
    {
      title: t('dashboard.totalStudents'),
      value: "2,450",
      change: `+12% ${t('dashboard.fromLastYear')}`,
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: t('dashboard.totalTeachers'),
      value: "148",
      change: `+5 ${t('dashboard.newThisMonth')}`,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: t('dashboard.activeClasses'),
      value: "86",
      change: t('dashboard.acrossAllGrades'),
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: t('dashboard.attendanceRate'),
      value: "92.5%",
      change: `+2.3% ${t('dashboard.thisMonth')}`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
