"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

// Extended theme customization types
export type BackgroundStyle = "solid" | "gradient" | "mesh" | "pattern"
export type BorderRadius = "none" | "small" | "medium" | "large" | "full"

export interface CustomColors {
  // Core colors
  background: string
  foreground: string
  card: string
  cardForeground: string
  
  // Primary & Accent
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  
  // Muted & Borders
  muted: string
  mutedForeground: string
  border: string
  input: string
  ring: string
  
  // Sidebar
  sidebar: string
  sidebarForeground: string
  sidebarPrimary: string
  sidebarAccent: string
  sidebarBorder: string
}

export interface ThemeCustomization {
  // Core UI colors
  backgroundColor: string
  componentColor: string // Cards, modals, etc.
  primaryColor: string
  accentColor: string
  textColor: string
  
  // Sidebar customization
  sidebarColor: string
  sidebarTextColor: string
  sidebarAccentColor: string
  
  // Border & Effects
  borderColor: string
  borderRadius: BorderRadius
  
  // Background style
  backgroundStyle: BackgroundStyle
  
  // Additional options
  mutedColor: string
  inputColor: string
  destructiveColor: string
  successColor: string
  warningColor: string
  
  // Dark mode overrides (optional)
  darkBackgroundColor: string
  darkComponentColor: string
  darkTextColor: string
  darkSidebarColor: string
}

interface ThemeCustomizerContextType {
  customization: ThemeCustomization
  setCustomization: (customization: Partial<ThemeCustomization>) => void
  resetToDefault: () => void
  applyPreset: (preset: string) => void
  presets: { name: string; label: string; colors: Partial<ThemeCustomization> }[]
}

const defaultCustomization: ThemeCustomization = {
  // Light mode defaults
  backgroundColor: "#ffffff",
  componentColor: "#ffffff",
  primaryColor: "#3b82f6",
  accentColor: "#f3f4f6",
  textColor: "#1f2937",
  
  sidebarColor: "#fafafa",
  sidebarTextColor: "#1f2937",
  sidebarAccentColor: "#f3f4f6",
  
  borderColor: "#e5e7eb",
  borderRadius: "medium",
  backgroundStyle: "solid",
  
  mutedColor: "#f3f4f6",
  inputColor: "#e5e7eb",
  destructiveColor: "#ef4444",
  successColor: "#22c55e",
  warningColor: "#f59e0b",
  
  // Dark mode defaults
  darkBackgroundColor: "#0f172a",
  darkComponentColor: "#1e293b",
  darkTextColor: "#f8fafc",
  darkSidebarColor: "#0f172a",
}

// Preset themes
export const themePresets = [
  {
    name: "default",
    label: "Default",
    colors: { ...defaultCustomization }
  },
  {
    name: "ocean",
    label: "Ocean Blue",
    colors: {
      backgroundColor: "#f0f9ff",
      componentColor: "#ffffff",
      primaryColor: "#0284c7",
      accentColor: "#e0f2fe",
      sidebarColor: "#0c4a6e",
      sidebarTextColor: "#f0f9ff",
      sidebarAccentColor: "#075985",
      borderColor: "#bae6fd",
      darkBackgroundColor: "#0c4a6e",
      darkComponentColor: "#075985",
      darkSidebarColor: "#082f49",
    }
  },
  {
    name: "forest",
    label: "Forest Green",
    colors: {
      backgroundColor: "#f0fdf4",
      componentColor: "#ffffff",
      primaryColor: "#16a34a",
      accentColor: "#dcfce7",
      sidebarColor: "#14532d",
      sidebarTextColor: "#f0fdf4",
      sidebarAccentColor: "#166534",
      borderColor: "#bbf7d0",
      darkBackgroundColor: "#14532d",
      darkComponentColor: "#166534",
      darkSidebarColor: "#052e16",
    }
  },
  {
    name: "sunset",
    label: "Sunset Orange",
    colors: {
      backgroundColor: "#fff7ed",
      componentColor: "#ffffff",
      primaryColor: "#ea580c",
      accentColor: "#ffedd5",
      sidebarColor: "#7c2d12",
      sidebarTextColor: "#fff7ed",
      sidebarAccentColor: "#9a3412",
      borderColor: "#fed7aa",
      darkBackgroundColor: "#7c2d12",
      darkComponentColor: "#9a3412",
      darkSidebarColor: "#431407",
    }
  },
  {
    name: "corporate",
    label: "Corporate Blue",
    colors: {
      backgroundColor: "#f8fafc",
      componentColor: "#ffffff",
      primaryColor: "#1e40af",
      accentColor: "#dbeafe",
      sidebarColor: "#1e3a5f",
      sidebarTextColor: "#f1f5f9",
      sidebarAccentColor: "#2d4a6f",
      borderColor: "#cbd5e1",
      darkBackgroundColor: "#0f172a",
      darkComponentColor: "#1e293b",
      darkSidebarColor: "#0c1929",
    }
  },
  {
    name: "executive",
    label: "Executive Gray",
    colors: {
      backgroundColor: "#f9fafb",
      componentColor: "#ffffff",
      primaryColor: "#374151",
      accentColor: "#e5e7eb",
      sidebarColor: "#1f2937",
      sidebarTextColor: "#f9fafb",
      sidebarAccentColor: "#374151",
      borderColor: "#d1d5db",
      darkBackgroundColor: "#111827",
      darkComponentColor: "#1f2937",
      darkSidebarColor: "#0d1117",
    }
  },
  {
    name: "slate",
    label: "Slate Gray",
    colors: {
      backgroundColor: "#f8fafc",
      componentColor: "#ffffff",
      primaryColor: "#475569",
      accentColor: "#f1f5f9",
      sidebarColor: "#1e293b",
      sidebarTextColor: "#f8fafc",
      sidebarAccentColor: "#334155",
      borderColor: "#e2e8f0",
      darkBackgroundColor: "#0f172a",
      darkComponentColor: "#1e293b",
      darkSidebarColor: "#020617",
    }
  },
  {
    name: "midnight",
    label: "Midnight",
    colors: {
      backgroundColor: "#1e1e2e",
      componentColor: "#282a36",
      primaryColor: "#bd93f9",
      accentColor: "#383a59",
      textColor: "#f8f8f2",
      sidebarColor: "#1a1a2e",
      sidebarTextColor: "#f8f8f2",
      sidebarAccentColor: "#44475a",
      borderColor: "#44475a",
      darkBackgroundColor: "#1e1e2e",
      darkComponentColor: "#282a36",
      darkTextColor: "#f8f8f2",
      darkSidebarColor: "#1a1a2e",
    }
  },
  {
    name: "mint",
    label: "Mint Fresh",
    colors: {
      backgroundColor: "#ecfdf5",
      componentColor: "#ffffff",
      primaryColor: "#10b981",
      accentColor: "#d1fae5",
      sidebarColor: "#064e3b",
      sidebarTextColor: "#ecfdf5",
      sidebarAccentColor: "#065f46",
      borderColor: "#a7f3d0",
      darkBackgroundColor: "#064e3b",
      darkComponentColor: "#065f46",
      darkSidebarColor: "#022c22",
    }
  },
  {
    name: "steel",
    label: "Steel Blue",
    colors: {
      backgroundColor: "#f1f5f9",
      componentColor: "#ffffff",
      primaryColor: "#334155",
      accentColor: "#e2e8f0",
      sidebarColor: "#0f172a",
      sidebarTextColor: "#e2e8f0",
      sidebarAccentColor: "#1e293b",
      borderColor: "#94a3b8",
      darkBackgroundColor: "#020617",
      darkComponentColor: "#0f172a",
      darkSidebarColor: "#020617",
    }
  },
  {
    name: "coffee",
    label: "Coffee",
    colors: {
      backgroundColor: "#faf7f5",
      componentColor: "#ffffff",
      primaryColor: "#78350f",
      accentColor: "#fef3c7",
      textColor: "#451a03",
      sidebarColor: "#451a03",
      sidebarTextColor: "#fef3c7",
      sidebarAccentColor: "#78350f",
      borderColor: "#fde68a",
      darkBackgroundColor: "#451a03",
      darkComponentColor: "#78350f",
      darkTextColor: "#fef3c7",
      darkSidebarColor: "#1c0a00",
    }
  },
  {
    name: "navy",
    label: "Navy Professional",
    colors: {
      backgroundColor: "#f8fafc",
      componentColor: "#ffffff",
      primaryColor: "#1e3a8a",
      accentColor: "#e0e7ff",
      textColor: "#1e293b",
      sidebarColor: "#0f172a",
      sidebarTextColor: "#e0e7ff",
      sidebarAccentColor: "#1e3a8a",
      borderColor: "#c7d2fe",
      darkBackgroundColor: "#020617",
      darkComponentColor: "#0f172a",
      darkTextColor: "#e0e7ff",
      darkSidebarColor: "#020617",
    }
  },
]

const ThemeCustomizerContext = createContext<ThemeCustomizerContextType | undefined>(undefined)

// Apply CSS custom properties
function applyCustomColors(customization: ThemeCustomization, isDark: boolean) {
  const root = document.documentElement
  
  // Determine which colors to use based on dark/light mode
  const bgColor = isDark ? customization.darkBackgroundColor : customization.backgroundColor
  const componentColor = isDark ? customization.darkComponentColor : customization.componentColor
  const textColor = isDark ? customization.darkTextColor : customization.textColor
  const sidebarColor = isDark ? customization.darkSidebarColor : customization.sidebarColor
  
  // Apply core colors as CSS variables (using hex directly)
  root.style.setProperty('--custom-background', bgColor)
  root.style.setProperty('--custom-foreground', textColor)
  root.style.setProperty('--custom-card', componentColor)
  root.style.setProperty('--custom-card-foreground', textColor)
  root.style.setProperty('--custom-primary', customization.primaryColor)
  root.style.setProperty('--custom-accent', customization.accentColor)
  root.style.setProperty('--custom-muted', customization.mutedColor)
  root.style.setProperty('--custom-border', customization.borderColor)
  root.style.setProperty('--custom-input', customization.inputColor)
  root.style.setProperty('--custom-sidebar', sidebarColor)
  root.style.setProperty('--custom-sidebar-foreground', customization.sidebarTextColor)
  root.style.setProperty('--custom-sidebar-accent', customization.sidebarAccentColor)
  root.style.setProperty('--custom-sidebar-border', customization.borderColor)
  root.style.setProperty('--custom-destructive', customization.destructiveColor)
  root.style.setProperty('--custom-success', customization.successColor)
  root.style.setProperty('--custom-warning', customization.warningColor)
  
  // Apply border radius
  const radiusValues = {
    none: "0px",
    small: "0.25rem",
    medium: "0.5rem",
    large: "0.75rem",
    full: "1rem"
  }
  root.style.setProperty('--radius', radiusValues[customization.borderRadius])
  
  // Apply background style
  root.setAttribute('data-bg-style', customization.backgroundStyle)
  
  // Mark that custom theme is active
  root.setAttribute('data-custom-theme', 'true')
}

export function ThemeCustomizerProvider({ children }: { children: ReactNode }) {
  const [customization, setCustomizationState] = useState<ThemeCustomization>(defaultCustomization)
  const [mounted, setMounted] = useState(false)

  // Load saved customization on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme-customization")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCustomizationState({ ...defaultCustomization, ...parsed })
      } catch (e) {
        console.error("Failed to parse saved theme customization")
      }
    }
    setMounted(true)
  }, [])

  // Apply colors when customization changes or theme changes
  useEffect(() => {
    if (!mounted) return
    
    const isDark = document.documentElement.classList.contains('dark')
    applyCustomColors(customization, isDark)
    
    // Also listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark')
          applyCustomColors(customization, isDark)
        }
      })
    })
    
    observer.observe(document.documentElement, { attributes: true })
    
    return () => observer.disconnect()
  }, [customization, mounted])

  const setCustomization = (updates: Partial<ThemeCustomization>) => {
    setCustomizationState(prev => {
      const newCustomization = { ...prev, ...updates }
      localStorage.setItem("theme-customization", JSON.stringify(newCustomization))
      return newCustomization
    })
  }

  const resetToDefault = () => {
    setCustomizationState(defaultCustomization)
    localStorage.removeItem("theme-customization")
    document.documentElement.removeAttribute('data-custom-theme')
    document.documentElement.removeAttribute('data-bg-style')
    
    // Clear all custom CSS properties
    const root = document.documentElement
    const customProps = [
      '--custom-background', '--custom-foreground', '--custom-card', '--custom-card-foreground',
      '--custom-primary', '--custom-accent', '--custom-muted', '--custom-border', '--custom-input',
      '--custom-sidebar', '--custom-sidebar-foreground', '--custom-sidebar-accent', '--custom-sidebar-border',
      '--custom-destructive', '--custom-success', '--custom-warning'
    ]
    customProps.forEach(prop => root.style.removeProperty(prop))
    root.style.setProperty('--radius', '0.625rem')
  }

  const applyPreset = (presetName: string) => {
    const preset = themePresets.find(p => p.name === presetName)
    if (preset) {
      setCustomization(preset.colors)
    }
  }

  return (
    <ThemeCustomizerContext.Provider 
      value={{ 
        customization, 
        setCustomization, 
        resetToDefault, 
        applyPreset,
        presets: themePresets 
      }}
    >
      {children}
    </ThemeCustomizerContext.Provider>
  )
}

export function useThemeCustomizer() {
  const context = useContext(ThemeCustomizerContext)
  if (!context) {
    throw new Error("useThemeCustomizer must be used within a ThemeCustomizerProvider")
  }
  return context
}
