"use client"

import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useThemeColor, themeColors } from "@/lib/theme-colors"
import { cn } from "@/lib/utils"

export function ThemeColorToggle() {
  const { themeColor, setThemeColor } = useThemeColor()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <span 
            className="absolute bottom-1 right-1 h-2 w-2 rounded-full border border-background"
            style={{ backgroundColor: themeColors.find(t => t.name === themeColor)?.color }}
          />
          <span className="sr-only">Change theme color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Theme Color</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themeColors.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => setThemeColor(theme.name)}
            className={cn(
              "flex items-center gap-3 cursor-pointer",
              themeColor === theme.name && "bg-accent"
            )}
          >
            <span
              className="h-5 w-5 rounded-full border border-border shadow-sm"
              style={{ backgroundColor: theme.color }}
            />
            <span>{theme.label}</span>
            {themeColor === theme.name && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
