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
      color: "text-pink-500",
      bgColor: "bg-gradient-to-br from-pink-50 to-pink-100/80 dark:from-pink-950/40 dark:to-pink-900/30",
      iconBg: "bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800/50 dark:to-pink-700/40",
      emoji: "🎀",
    },
    {
      title: t('dashboard.totalTeachers'),
      value: "148",
      change: `+5 ${t('dashboard.newThisMonth')}`,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100/80 dark:from-purple-950/40 dark:to-purple-900/30",
      iconBg: "bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-800/50 dark:to-purple-700/40",
      emoji: "💜",
    },
    {
      title: t('dashboard.activeClasses'),
      value: "86",
      change: t('dashboard.acrossAllGrades'),
      icon: BookOpen,
      color: "text-sky-500",
      bgColor: "bg-gradient-to-br from-sky-50 to-sky-100/80 dark:from-sky-950/40 dark:to-sky-900/30",
      iconBg: "bg-gradient-to-br from-sky-200 to-sky-300 dark:from-sky-800/50 dark:to-sky-700/40",
      emoji: "📚",
    },
    {
      title: t('dashboard.attendanceRate'),
      value: "92.5%",
      change: `+2.3% ${t('dashboard.thisMonth')}`,
      icon: TrendingUp,
      color: "text-rose-500",
      bgColor: "bg-gradient-to-br from-rose-50 to-rose-100/80 dark:from-rose-950/40 dark:to-rose-900/30",
      iconBg: "bg-gradient-to-br from-rose-200 to-rose-300 dark:from-rose-800/50 dark:to-rose-700/40",
      emoji: "⭐",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={stat.title} className={`stats-card transition-all duration-300 hover:shadow-xl border-2 border-pink-200/50 dark:border-pink-800/30 ${stat.bgColor} animate-fade-in-up overflow-visible`} style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <span>{stat.emoji}</span> {stat.title}
            </CardTitle>
            <div className={`icon-badge ${stat.iconBg} shadow-md`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
