"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Annual Day Function",
    date: "Dec 20, 2024",
    time: "10:00 AM",
    type: "event",
    color: "bg-purple-500",
  },
  {
    id: 2,
    title: "Parent-Teacher Meeting",
    date: "Dec 15, 2024",
    time: "09:00 AM",
    type: "meeting",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Half-Yearly Exams Begin",
    date: "Dec 18, 2024",
    time: "08:30 AM",
    type: "exam",
    color: "bg-red-500",
  },
  {
    id: 4,
    title: "Sports Day",
    date: "Dec 25, 2024",
    time: "08:00 AM",
    type: "sports",
    color: "bg-green-500",
  },
  {
    id: 5,
    title: "Winter Vacation Begins",
    date: "Dec 28, 2024",
    time: "-",
    type: "holiday",
    color: "bg-orange-500",
  },
]

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>School calendar for this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 rounded-lg border p-3"
            >
              <div className={`h-2 w-2 rounded-full ${event.color}`} />
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {event.date}
                  </span>
                  {event.time !== "-" && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="outline">{event.type}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
