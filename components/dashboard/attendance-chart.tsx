"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/lib/i18n/language-context"

const attendanceData = [
  { day: "Mon", present: 2280, absent: 170 },
  { day: "Tue", present: 2350, absent: 100 },
  { day: "Wed", present: 2200, absent: 250 },
  { day: "Thu", present: 2380, absent: 70 },
  { day: "Fri", present: 2300, absent: 150 },
]

export function AttendanceChart() {
  const { t } = useLanguage()

  const chartConfig = {
    present: {
      label: t('dashboard.present'),
      color: "hsl(var(--chart-1))",
    },
    absent: {
      label: t('dashboard.absent'),
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.weeklyAttendance')}</CardTitle>
        <CardDescription>{t('dashboard.studentAttendanceWeek')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="present" fill="var(--color-present)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="var(--color-absent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
