"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

export type ThemeColor = 
  | "neutral"
  | "blue" 
  | "green"
  | "teal"
  | "indigo"
  | "slate"

interface ThemeColorContextType {
  themeColor: ThemeColor
  setThemeColor: (color: ThemeColor) => void
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined)

export const themeColors: { name: ThemeColor; label: string; color: string }[] = [
  { name: "neutral", label: "Neutral", color: "#737373" },
  { name: "blue", label: "Blue", color: "#3b82f6" },
  { name: "green", label: "Green", color: "#22c55e" },
  { name: "teal", label: "Teal", color: "#14b8a6" },
  { name: "indigo", label: "Indigo", color: "#6366f1" },
  { name: "slate", label: "Slate", color: "#64748b" },
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
