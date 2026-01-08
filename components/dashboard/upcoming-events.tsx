"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function UpcomingEvents() {
  const { t } = useLanguage()

  const events = [
    {
      id: 1,
      title: t('dashboard.annualDayFunction'),
      date: "Dec 20, 2024",
      time: "10:00 AM",
      type: "event",
      typeLabel: t('dashboard.event'),
      color: "bg-gradient-to-r from-purple-400 to-pink-400",
      emoji: "🎉",
    },
    {
      id: 2,
      title: t('dashboard.parentTeacherMeeting'),
      date: "Dec 15, 2024",
      time: "09:00 AM",
      type: "meeting",
      typeLabel: t('dashboard.meeting'),
      color: "bg-gradient-to-r from-sky-400 to-blue-400",
      emoji: "👥",
    },
    {
      id: 3,
      title: t('dashboard.halfYearlyExams'),
      date: "Dec 18, 2024",
      time: "08:30 AM",
      type: "exam",
      typeLabel: t('dashboard.exam'),
      color: "bg-gradient-to-r from-rose-400 to-red-400",
      emoji: "📝",
    },
    {
      id: 4,
      title: t('dashboard.sportsDay'),
      date: "Dec 25, 2024",
      time: "08:00 AM",
      type: "sports",
      typeLabel: t('dashboard.sports'),
      color: "bg-gradient-to-r from-emerald-400 to-teal-400",
      emoji: "⚽",
    },
    {
      id: 5,
      title: t('dashboard.winterVacation'),
      date: "Dec 28, 2024",
      time: "-",
      type: "holiday",
      typeLabel: t('dashboard.holiday'),
      color: "bg-gradient-to-r from-amber-400 to-orange-400",
      emoji: "🏖️",
    },
  ]

  return (
    <Card className="border-2 border-pink-200/50 dark:border-pink-800/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">📅 {t('dashboard.upcomingEvents')}</CardTitle>
        <CardDescription>{t('dashboard.schoolCalendar')} ✨</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 rounded-2xl border-2 border-pink-100 dark:border-pink-900/30 p-3 hover:bg-pink-50/50 dark:hover:bg-pink-900/20 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="text-xl">{event.emoji}</div>
              <div className={`h-3 w-3 rounded-full ${event.color} shadow-sm`} />
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3 text-pink-400" />
                    {event.date}
                  </span>
                  {event.time !== "-" && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-pink-400" />
                      {event.time}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="rounded-full">{event.typeLabel}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
