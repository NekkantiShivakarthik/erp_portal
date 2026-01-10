"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

export type ThemeColor = 
  | "neutral"
  | "blue" 
  | "green"
  | "purple"
  | "orange"
  | "rose"
  | "teal"
  | "indigo"

interface ThemeColorContextType {
  themeColor: ThemeColor
  setThemeColor: (color: ThemeColor) => void
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined)

export const themeColors: { name: ThemeColor; label: string; color: string }[] = [
  { name: "neutral", label: "Neutral", color: "#737373" },
  { name: "blue", label: "Blue", color: "#3b82f6" },
  { name: "green", label: "Green", color: "#22c55e" },
  { name: "purple", label: "Purple", color: "#a855f7" },
  { name: "orange", label: "Orange", color: "#f97316" },
  { name: "rose", label: "Rose", color: "#f43f5e" },
  { name: "teal", label: "Teal", color: "#14b8a6" },
  { name: "indigo", label: "Indigo", color: "#6366f1" },
]

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColorState] = useState<ThemeColor>("neutral")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedColor = localStorage.getItem("theme-color") as ThemeColor
    if (savedColor && themeColors.some(t => t.name === savedColor)) {
      setThemeColorState(savedColor)
      document.documentElement.setAttribute("data-theme-color", savedColor)
    }
    setMounted(true)
  }, [])

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color)
    localStorage.setItem("theme-color", color)
    document.documentElement.setAttribute("data-theme-color", color)
  }

  // Always provide context, but use default values when not mounted
  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  )
}

export function useThemeColor() {
  const context = useContext(ThemeColorContext)
  if (!context) {
    throw new Error("useThemeColor must be used within a ThemeColorProvider")
  }
  return context
}
