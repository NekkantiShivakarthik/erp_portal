"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const feeData = [
  {
    grade: "Primary (1-5)",
    collected: 85,
    amount: "₹12,50,000",
    pending: "₹2,20,000",
  },
  {
    grade: "Middle (6-8)",
    collected: 78,
    amount: "₹9,80,000",
    pending: "₹2,75,000",
  },
  {
    grade: "Secondary (9-10)",
    collected: 92,
    amount: "₹14,20,000",
    pending: "₹1,23,000",
  },
  {
    grade: "Senior Sec (11-12)",
    collected: 88,
    amount: "₹8,90,000",
    pending: "₹1,21,000",
  },
]

export function FeeOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Collection Overview</CardTitle>
        <CardDescription>Current academic year fee status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {feeData.map((item) => (
          <div key={item.grade} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.grade}</span>
              <span className="text-muted-foreground">{item.collected}%</span>
            </div>
            <Progress value={item.collected} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Collected: {item.amount}</span>
              <span>Pending: {item.pending}</span>
            </div>
          </div>
        ))}
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Collected</p>
              <p className="text-2xl font-bold text-green-600">₹45,40,000</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Total Pending</p>
              <p className="text-2xl font-bold text-orange-600">₹7,39,000</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
