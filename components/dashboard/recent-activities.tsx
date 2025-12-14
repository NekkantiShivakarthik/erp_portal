"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const activities = [
  {
    id: 1,
    user: "Priya Sharma",
    action: "submitted fee payment",
    amount: "₹4,500",
    time: "2 min ago",
    type: "payment",
    avatar: "PS",
  },
  {
    id: 2,
    user: "Rajesh Kumar",
    action: "marked attendance for Class 10A",
    time: "15 min ago",
    type: "attendance",
    avatar: "RK",
  },
  {
    id: 3,
    user: "New Student",
    action: "admission approved",
    details: "Amit Singh - Class 6B",
    time: "1 hour ago",
    type: "admission",
    avatar: "AS",
  },
  {
    id: 4,
    user: "System",
    action: "generated monthly report",
    details: "November 2024",
    time: "2 hours ago",
    type: "system",
    avatar: "SY",
  },
  {
    id: 5,
    user: "Sunita Devi",
    action: "updated class timetable",
    details: "Class 8B",
    time: "3 hours ago",
    type: "update",
    avatar: "SD",
  },
  {
    id: 6,
    user: "Transport Dept",
    action: "added new bus route",
    details: "Route #15 - Sector 22",
    time: "4 hours ago",
    type: "transport",
    avatar: "TD",
  },
]

const typeColors: Record<string, string> = {
  payment: "bg-green-100 text-green-800",
  attendance: "bg-blue-100 text-blue-800",
  admission: "bg-purple-100 text-purple-800",
  system: "bg-gray-100 text-gray-800",
  update: "bg-orange-100 text-orange-800",
  transport: "bg-yellow-100 text-yellow-800",
}

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest updates across the school</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 rounded-lg border p-3"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`/avatars/${activity.id}.jpg`} />
                  <AvatarFallback>{activity.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.user}</span>
                    <Badge variant="secondary" className={typeColors[activity.type]}>
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                    {activity.amount && (
                      <span className="font-medium text-green-600"> {activity.amount}</span>
                    )}
                    {activity.details && (
                      <span className="font-medium"> - {activity.details}</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
