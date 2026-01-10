"use client"

import { useState } from "react"
import { 
  Palette, 
  PaintBucket, 
  Layout, 
  Square, 
  Sidebar, 
  RotateCcw,
  Check,
  Sparkles,
  Moon,
  Sun,
  ChevronDown,
  Eye,
  Monitor,
  Smartphone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useThemeCustomizer, themePresets, BackgroundStyle, BorderRadius, ThemeCustomization } from "@/lib/theme-customizer"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
}

const quickColors = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#64748b", "#1f2937", "#ffffff",
]

function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const [showPresets, setShowPresets] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="w-10 h-10 rounded-lg border-2 border-border shadow-sm cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: value }}
            onClick={() => setShowPresets(!showPresets)}
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-24 h-10 text-xs font-mono"
            placeholder="#000000"
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border-0 p-0"
          />
        </div>
      </div>
      {showPresets && (
        <div className="grid grid-cols-10 gap-1.5 p-3 bg-muted/50 rounded-lg border">
          {quickColors.map((color) => (
            <button
              key={color}
              className={cn(
                "w-7 h-7 rounded-md border border-border hover:scale-110 transition-transform shadow-sm",
                value.toLowerCase() === color.toLowerCase() && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color)
                setShowPresets(false)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PresetCard({ 
  preset, 
  isActive, 
  onSelect 
}: { 
  preset: { name: string; label: string; colors: Partial<ThemeCustomization> }
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all hover:scale-[1.02] text-left w-full",
        isActive 
          ? "border-primary ring-2 ring-primary/20 bg-primary/5" 
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="w-5 h-5 rounded-full shadow-sm"
          style={{ backgroundColor: preset.colors.primaryColor || "#3b82f6" }}
        />
        <span className="font-medium">{preset.label}</span>
        {isActive && <Check className="w-4 h-4 text-primary ml-auto" />}
      </div>
      <div className="flex gap-1 rounded-lg overflow-hidden border">
        <div 
          className="flex-1 h-10"
          style={{ backgroundColor: preset.colors.backgroundColor || "#ffffff" }}
        />
        <div 
          className="w-10 h-10"
          style={{ backgroundColor: preset.colors.sidebarColor || "#fafafa" }}
        />
        <div 
          className="flex-1 h-10"
          style={{ backgroundColor: preset.colors.componentColor || preset.colors.backgroundColor || "#ffffff" }}
        />
      </div>
    </button>
  )
}

export function AppearanceSettings() {
  const { customization, setCustomization, resetToDefault, applyPreset, presets } = useThemeCustomizer()
  const { theme, setTheme } = useTheme()
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>(["presets"])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handlePresetSelect = (presetName: string) => {
    setActivePreset(presetName)
    applyPreset(presetName)
  }

  return (
    <div className="space-y-6">
      {/* Theme Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Theme Mode
          </CardTitle>
          <CardDescription>
            Choose between light, dark, or system theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                theme === "light" 
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center">
                <Sun className="h-6 w-6 text-orange-600" />
              </div>
              <span className="font-medium">Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                theme === "dark" 
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-800 to-purple-900 flex items-center justify-center">
                <Moon className="h-6 w-6 text-purple-200" />
              </div>
              <span className="font-medium">Dark</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                theme === "system" 
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center">
                <Monitor className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
              <span className="font-medium">System</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Theme Presets
          </CardTitle>
          <CardDescription>
            Quick-apply beautiful pre-designed themes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {presets.map((preset) => (
              <PresetCard
                key={preset.name}
                preset={preset}
                isActive={activePreset === preset.name}
                onSelect={() => handlePresetSelect(preset.name)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Custom Colors
          </CardTitle>
          <CardDescription>
            Fine-tune individual color settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Colors */}
          <Collapsible 
            open={expandedSections.includes("core")}
            onOpenChange={() => toggleSection("core")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <PaintBucket className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold block">Core Colors</span>
                  <span className="text-xs text-muted-foreground">Background, cards, text colors</span>
                </div>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 transition-transform",
                expandedSections.includes("core") && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4 px-2">
              <ColorPicker
                label="Background Color"
                value={customization.backgroundColor}
                onChange={(value) => setCustomization({ backgroundColor: value })}
                description="Main page background"
              />
              <ColorPicker
                label="Component Color"
                value={customization.componentColor}
                onChange={(value) => setCustomization({ componentColor: value })}
                description="Cards, dialogs, modals"
              />
              <ColorPicker
                label="Primary Color"
                value={customization.primaryColor}
                onChange={(value) => setCustomization({ primaryColor: value })}
                description="Buttons, links, highlights"
              />
              <ColorPicker
                label="Accent Color"
                value={customization.accentColor}
                onChange={(value) => setCustomization({ accentColor: value })}
                description="Hover states, secondary highlights"
              />
              <ColorPicker
                label="Text Color"
                value={customization.textColor}
                onChange={(value) => setCustomization({ textColor: value })}
                description="Main text color"
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Sidebar Colors */}
          <Collapsible 
            open={expandedSections.includes("sidebar")}
            onOpenChange={() => toggleSection("sidebar")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Sidebar className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold block">Sidebar Colors</span>
                  <span className="text-xs text-muted-foreground">Navigation sidebar styling</span>
                </div>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 transition-transform",
                expandedSections.includes("sidebar") && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4 px-2">
              <ColorPicker
                label="Sidebar Background"
                value={customization.sidebarColor}
                onChange={(value) => setCustomization({ sidebarColor: value })}
                description="Navigation sidebar background"
              />
              <ColorPicker
                label="Sidebar Text"
                value={customization.sidebarTextColor}
                onChange={(value) => setCustomization({ sidebarTextColor: value })}
                description="Menu item text color"
              />
              <ColorPicker
                label="Sidebar Accent"
                value={customization.sidebarAccentColor}
                onChange={(value) => setCustomization({ sidebarAccentColor: value })}
                description="Active item background"
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Status Colors */}
          <Collapsible 
            open={expandedSections.includes("status")}
            onOpenChange={() => toggleSection("status")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-red-500 flex items-center justify-center">
                  <Square className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold block">Status Colors</span>
                  <span className="text-xs text-muted-foreground">Success, warning, error states</span>
                </div>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 transition-transform",
                expandedSections.includes("status") && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4 px-2">
              <ColorPicker
                label="Success Color"
                value={customization.successColor}
                onChange={(value) => setCustomization({ successColor: value })}
                description="Positive indicators"
              />
              <ColorPicker
                label="Warning Color"
                value={customization.warningColor}
                onChange={(value) => setCustomization({ warningColor: value })}
                description="Caution indicators"
              />
              <ColorPicker
                label="Destructive Color"
                value={customization.destructiveColor}
                onChange={(value) => setCustomization({ destructiveColor: value })}
                description="Error and delete actions"
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Border & UI */}
          <Collapsible 
            open={expandedSections.includes("border")}
            onOpenChange={() => toggleSection("border")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <Layout className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold block">Borders & UI Elements</span>
                  <span className="text-xs text-muted-foreground">Dividers, inputs, muted areas</span>
                </div>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 transition-transform",
                expandedSections.includes("border") && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4 px-2">
              <ColorPicker
                label="Border Color"
                value={customization.borderColor}
                onChange={(value) => setCustomization({ borderColor: value })}
                description="Borders and dividers"
              />
              <ColorPicker
                label="Muted Background"
                value={customization.mutedColor}
                onChange={(value) => setCustomization({ mutedColor: value })}
                description="Disabled/subtle backgrounds"
              />
              <ColorPicker
                label="Input Border"
                value={customization.inputColor}
                onChange={(value) => setCustomization({ inputColor: value })}
                description="Form input borders"
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Dark Mode Colors */}
          <Collapsible 
            open={expandedSections.includes("dark")}
            onOpenChange={() => toggleSection("dark")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-800 to-purple-900 flex items-center justify-center">
                  <Moon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold block">Dark Mode Overrides</span>
                  <span className="text-xs text-muted-foreground">Customize dark theme colors</span>
                </div>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 transition-transform",
                expandedSections.includes("dark") && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4 px-2">
              <ColorPicker
                label="Dark Background"
                value={customization.darkBackgroundColor}
                onChange={(value) => setCustomization({ darkBackgroundColor: value })}
                description="Dark mode page background"
              />
              <ColorPicker
                label="Dark Component"
                value={customization.darkComponentColor}
                onChange={(value) => setCustomization({ darkComponentColor: value })}
                description="Dark mode card/component color"
              />
              <ColorPicker
                label="Dark Text"
                value={customization.darkTextColor}
                onChange={(value) => setCustomization({ darkTextColor: value })}
                description="Dark mode text color"
              />
              <ColorPicker
                label="Dark Sidebar"
                value={customization.darkSidebarColor}
                onChange={(value) => setCustomization({ darkSidebarColor: value })}
                description="Dark mode sidebar color"
              />
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Layout Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Layout Options
          </CardTitle>
          <CardDescription>
            Customize background styles and border radius
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Background Style</Label>
            <Select
              value={customization.backgroundStyle}
              onValueChange={(value: BackgroundStyle) => setCustomization({ backgroundStyle: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select background style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-background border" />
                    Solid Color
                  </div>
                </SelectItem>
                <SelectItem value="gradient">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-background to-muted" />
                    Soft Gradient
                  </div>
                </SelectItem>
                <SelectItem value="mesh">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-primary/20 via-background to-accent/20" />
                    Gradient Mesh
                  </div>
                </SelectItem>
                <SelectItem value="pattern">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-background border border-dashed" />
                    Subtle Pattern
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Border Radius</Label>
            <Select
              value={customization.borderRadius}
              onValueChange={(value: BorderRadius) => setCustomization({ borderRadius: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select border radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted border" />
                    None (Sharp)
                  </div>
                </SelectItem>
                <SelectItem value="small">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted border rounded-sm" />
                    Small (0.25rem)
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted border rounded" />
                    Medium (0.5rem)
                  </div>
                </SelectItem>
                <SelectItem value="large">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted border rounded-lg" />
                    Large (0.75rem)
                  </div>
                </SelectItem>
                <SelectItem value="full">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted border rounded-xl" />
                    Extra Large (1rem)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
          <CardDescription>
            See how your theme looks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="p-6 rounded-xl border-2"
            style={{ 
              backgroundColor: customization.backgroundColor,
              borderColor: customization.borderColor,
              borderRadius: customization.borderRadius === "none" ? "0" : 
                           customization.borderRadius === "small" ? "0.25rem" :
                           customization.borderRadius === "medium" ? "0.5rem" :
                           customization.borderRadius === "large" ? "0.75rem" : "1rem"
            }}
          >
            <div className="flex gap-4">
              {/* Mini Sidebar */}
              <div 
                className="w-16 rounded-lg p-2 space-y-2"
                style={{ 
                  backgroundColor: customization.sidebarColor,
                }}
              >
                <div 
                  className="w-full h-8 rounded"
                  style={{ backgroundColor: customization.sidebarAccentColor }}
                />
                <div 
                  className="w-full h-6 rounded opacity-50"
                  style={{ backgroundColor: customization.sidebarAccentColor }}
                />
                <div 
                  className="w-full h-6 rounded opacity-50"
                  style={{ backgroundColor: customization.sidebarAccentColor }}
                />
              </div>
              
              {/* Main Content */}
              <div className="flex-1 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span style={{ color: customization.textColor }} className="font-semibold">
                    Dashboard Preview
                  </span>
                  <div 
                    className="px-3 py-1 rounded text-sm text-white"
                    style={{ backgroundColor: customization.primaryColor }}
                  >
                    Primary Button
                  </div>
                </div>
                
                {/* Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className="p-4 rounded-lg"
                    style={{ 
                      backgroundColor: customization.componentColor,
                      borderRadius: customization.borderRadius === "none" ? "0" : 
                                   customization.borderRadius === "small" ? "0.25rem" :
                                   customization.borderRadius === "medium" ? "0.5rem" :
                                   customization.borderRadius === "large" ? "0.75rem" : "1rem"
                    }}
                  >
                    <div style={{ color: customization.textColor }} className="font-medium text-sm">
                      Card Title
                    </div>
                    <div style={{ color: customization.textColor }} className="opacity-60 text-xs mt-1">
                      Card content here
                    </div>
                  </div>
                  <div 
                    className="p-4 rounded-lg"
                    style={{ 
                      backgroundColor: customization.accentColor,
                      borderRadius: customization.borderRadius === "none" ? "0" : 
                                   customization.borderRadius === "small" ? "0.25rem" :
                                   customization.borderRadius === "medium" ? "0.5rem" :
                                   customization.borderRadius === "large" ? "0.75rem" : "1rem"
                    }}
                  >
                    <div style={{ color: customization.textColor }} className="font-medium text-sm">
                      Accent Card
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span 
                        className="px-2 py-0.5 rounded text-xs text-white"
                        style={{ backgroundColor: customization.successColor }}
                      >
                        Success
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded text-xs text-white"
                        style={{ backgroundColor: customization.warningColor }}
                      >
                        Warning
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={resetToDefault}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Default
        </Button>
      </div>
    </div>
  )
}
