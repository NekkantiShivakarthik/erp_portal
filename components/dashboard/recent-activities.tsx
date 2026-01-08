"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/lib/i18n/language-context"

const typeColors: Record<string, string> = {
  payment: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-900/40 dark:to-teal-900/40 dark:text-emerald-300",
  attendance: "bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 dark:from-sky-900/40 dark:to-blue-900/40 dark:text-sky-300",
  admission: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 dark:from-purple-900/40 dark:to-pink-900/40 dark:text-purple-300",
  system: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800/40 dark:to-slate-800/40 dark:text-gray-300",
  update: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/40 dark:to-orange-900/40 dark:text-amber-300",
  transport: "bg-gradient-to-r from-yellow-100 to-lime-100 text-yellow-700 dark:from-yellow-900/40 dark:to-lime-900/40 dark:text-yellow-300",
}

const typeEmojis: Record<string, string> = {
  payment: "💰",
  attendance: "📋",
  admission: "🎓",
  system: "⚙️",
  update: "📝",
  transport: "🚌",
}

export function RecentActivities() {
  const { t } = useLanguage()

  const activities = [
    {
      id: 1,
      user: "Priya Sharma",
      action: t('dashboard.submittedFeePayment'),
      amount: "₹4,500",
      time: "2 min ago",
      type: "payment",
      typeLabel: t('dashboard.payment'),
      avatar: "PS",
    },
    {
      id: 2,
      user: "Rajesh Kumar",
      action: `${t('dashboard.markedAttendance')} Class 10A`,
      time: "15 min ago",
      type: "attendance",
      typeLabel: t('dashboard.attendance'),
      avatar: "RK",
    },
    {
      id: 3,
      user: "New Student",
      action: t('dashboard.admissionApproved'),
      details: "Amit Singh - Class 6B",
      time: "1 hour ago",
      type: "admission",
      typeLabel: t('dashboard.admission'),
      avatar: "AS",
    },
    {
      id: 4,
      user: "System",
      action: t('dashboard.generatedMonthlyReport'),
      details: "November 2024",
      time: "2 hours ago",
      type: "system",
      typeLabel: t('dashboard.system'),
      avatar: "SY",
    },
    {
      id: 5,
      user: "Sunita Devi",
      action: t('dashboard.updatedTimetable'),
      details: "Class 8B",
      time: "3 hours ago",
      type: "update",
      typeLabel: t('dashboard.update'),
      avatar: "SD",
    },
    {
      id: 6,
      user: "Transport Dept",
      action: t('dashboard.addedBusRoute'),
      details: "Route #15 - Sector 22",
      time: "4 hours ago",
      type: "transport",
      typeLabel: t('dashboard.transport'),
      avatar: "TD",
    },
  ]

  return (
    <Card className="border-2 border-pink-200/50 dark:border-pink-800/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">⚡ {t('dashboard.recentActivities')}</CardTitle>
        <CardDescription>{t('dashboard.latestUpdates')} ✨</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px]">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 rounded-2xl border-2 border-pink-100 dark:border-pink-900/30 p-3 hover:bg-pink-50/50 dark:hover:bg-pink-900/20 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/avatars/${activity.id}.jpg`} />
                  <AvatarFallback>{activity.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.user}</span>
                    <Badge variant="secondary" className={`${typeColors[activity.type]} rounded-full px-2.5`}>
                      {typeEmojis[activity.type]} {activity.typeLabel}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                    {activity.amount && (
                      <span className="font-medium text-emerald-600 dark:text-emerald-400"> {activity.amount}</span>
                    )}
                    {activity.details && (
                      <span className="font-medium text-pink-600 dark:text-pink-400"> - {activity.details}</span>
                    )}
                  </p>
                  <p className="text-xs text-pink-400/70 dark:text-pink-300/50 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"></span>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
