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
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
      iconBg: "bg-blue-500/10",
    },
    {
      title: t('dashboard.totalTeachers'),
      value: "148",
      change: `+5 ${t('dashboard.newThisMonth')}`,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950/30 dark:to-emerald-900/20",
      iconBg: "bg-green-500/10",
    },
    {
      title: t('dashboard.activeClasses'),
      value: "86",
      change: t('dashboard.acrossAllGrades'),
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-100/50 dark:from-purple-950/30 dark:to-violet-900/20",
      iconBg: "bg-purple-500/10",
    },
    {
      title: t('dashboard.attendanceRate'),
      value: "92.5%",
      change: `+2.3% ${t('dashboard.thisMonth')}`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-amber-100/50 dark:from-orange-950/30 dark:to-amber-900/20",
      iconBg: "bg-orange-500/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={stat.title} className={`stats-card transition-all duration-300 hover:shadow-xl border-0 ${stat.bgColor} animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`icon-badge ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.color.replace('600', '700')} dark:${stat.color.replace('600', '400')}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
