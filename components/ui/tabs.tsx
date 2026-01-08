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
        "bg-pink-100/80 dark:bg-pink-900/30 text-muted-foreground inline-flex h-11 w-fit items-center justify-center rounded-2xl p-1 border-2 border-pink-200/50 dark:border-pink-800/30",
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
        "data-[state=active]:bg-white dark:data-[state=active]:bg-pink-800/50 data-[state=active]:text-pink-600 dark:data-[state=active]:text-pink-200 focus-visible:border-pink-400 focus-visible:ring-pink-400/50 data-[state=active]:shadow-md text-pink-500/70 dark:text-pink-300/70 inline-flex h-[calc(100%-4px)] flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-transparent px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:text-pink-600 dark:hover:text-pink-200",
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
