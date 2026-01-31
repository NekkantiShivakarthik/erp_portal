"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-slate-100/80 dark:bg-slate-800/50 text-muted-foreground inline-flex h-11 w-fit items-center justify-center rounded-2xl p-1 border-2 border-slate-200/50 dark:border-slate-700/50",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700/50 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-300 focus-visible:border-blue-400 focus-visible:ring-blue-400/50 data-[state=active]:shadow-md text-slate-500/70 dark:text-slate-400/70 inline-flex h-[calc(100%-4px)] flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-transparent px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:text-blue-600 dark:hover:text-blue-300",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
