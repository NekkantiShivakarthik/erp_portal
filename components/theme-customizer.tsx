"use client"

import { useState } from "react"
import { 
  Palette, 
  PaintBucket, 
  Layout, 
  Type, 
  Square, 
  Sidebar, 
  RotateCcw,
  Check,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  SlidersHorizontal,
  Paintbrush,
  Copy,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Preset colors for quick selection
  const presetColors = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
    "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
    "#ec4899", "#f43f5e", "#64748b", "#1f2937", "#ffffff",
  ]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg border-2 border-border shadow-sm cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: value }}
            onClick={() => setIsOpen(!isOpen)}
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-24 h-8 text-xs font-mono"
            placeholder="#000000"
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
          />
        </div>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {isOpen && (
        <div className="grid grid-cols-10 gap-1 p-2 bg-muted rounded-lg">
          {presetColors.map((color) => (
            <button
              key={color}
              className={cn(
                "w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform",
                value === color && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color)
                setIsOpen(false)
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
        "relative p-3 rounded-xl border-2 transition-all hover:scale-[1.02]",
        isActive 
          ? "border-primary ring-2 ring-primary/20" 
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: preset.colors.primaryColor || "#3b82f6" }}
        />
        <span className="text-sm font-medium">{preset.label}</span>
        {isActive && <Check className="w-4 h-4 text-primary ml-auto" />}
      </div>
      <div className="flex gap-1">
        <div 
          className="flex-1 h-8 rounded-l-md"
          style={{ backgroundColor: preset.colors.backgroundColor || "#ffffff" }}
        />
        <div 
          className="w-8 h-8"
          style={{ backgroundColor: preset.colors.sidebarColor || "#fafafa" }}
        />
        <div 
          className="flex-1 h-8 rounded-r-md"
          style={{ backgroundColor: preset.colors.componentColor || preset.colors.backgroundColor || "#ffffff" }}
        />
      </div>
    </button>
  )
}

export function ThemeCustomizer() {
  const { customization, setCustomization, resetToDefault, applyPreset, presets } = useThemeCustomizer()
  const { theme } = useTheme()
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

  const copyThemeConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(customization, null, 2))
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <SlidersHorizontal className="h-5 w-5" />
          <Sparkles className="absolute -top-0.5 -right-0.5 h-3 w-3 text-primary animate-pulse" />
          <span className="sr-only">Customize Theme</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-hidden p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-primary" />
            Theme Customizer
          </SheetTitle>
          <SheetDescription>
            Personalize your dashboard colors and appearance
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-10rem)] px-6">
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="presets" className="gap-1">
                <Sparkles className="h-4 w-4" />
                Presets
              </TabsTrigger>
              <TabsTrigger value="colors" className="gap-1">
                <Palette className="h-4 w-4" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-1">
                <SlidersHorizontal className="h-4 w-4" />
                Advanced
              </TabsTrigger>
            </TabsList>

            {/* Presets Tab */}
            <TabsContent value="presets" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {presets.map((preset) => (
                  <PresetCard
                    key={preset.name}
                    preset={preset}
                    isActive={activePreset === preset.name}
                    onSelect={() => handlePresetSelect(preset.name)}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-6">
              {/* Core Colors */}
              <Collapsible 
                open={expandedSections.includes("core")}
                onOpenChange={() => toggleSection("core")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80">
                  <div className="flex items-center gap-2">
                    <PaintBucket className="h-4 w-4 text-primary" />
                    <span className="font-medium">Core Colors</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    expandedSections.includes("core") && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  <ColorPicker
                    label="Background"
                    value={customization.backgroundColor}
                    onChange={(value) => setCustomization({ backgroundColor: value })}
                    description="Main page background color"
                  />
                  <ColorPicker
                    label="Component/Card"
                    value={customization.componentColor}
                    onChange={(value) => setCustomization({ componentColor: value })}
                    description="Cards, dialogs, and component backgrounds"
                  />
                  <ColorPicker
                    label="Primary"
                    value={customization.primaryColor}
                    onChange={(value) => setCustomization({ primaryColor: value })}
                    description="Buttons, links, and highlights"
                  />
                  <ColorPicker
                    label="Accent"
                    value={customization.accentColor}
                    onChange={(value) => setCustomization({ accentColor: value })}
                    description="Hover states and secondary highlights"
                  />
                  <ColorPicker
                    label="Text"
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
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80">
                  <div className="flex items-center gap-2">
                    <Sidebar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Sidebar Colors</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    expandedSections.includes("sidebar") && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
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
                    description="Sidebar menu text color"
                  />
                  <ColorPicker
                    label="Sidebar Accent"
                    value={customization.sidebarAccentColor}
                    onChange={(value) => setCustomization({ sidebarAccentColor: value })}
                    description="Active item and hover background"
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Status Colors */}
              <Collapsible 
                open={expandedSections.includes("status")}
                onOpenChange={() => toggleSection("status")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80">
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-primary" />
                    <span className="font-medium">Status Colors</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    expandedSections.includes("status") && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  <ColorPicker
                    label="Success"
                    value={customization.successColor}
                    onChange={(value) => setCustomization({ successColor: value })}
                    description="Success states and positive indicators"
                  />
                  <ColorPicker
                    label="Warning"
                    value={customization.warningColor}
                    onChange={(value) => setCustomization({ warningColor: value })}
                    description="Warning states and alerts"
                  />
                  <ColorPicker
                    label="Destructive"
                    value={customization.destructiveColor}
                    onChange={(value) => setCustomization({ destructiveColor: value })}
                    description="Error states and delete actions"
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Border & UI */}
              <Collapsible 
                open={expandedSections.includes("border")}
                onOpenChange={() => toggleSection("border")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80">
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-primary" />
                    <span className="font-medium">Borders & UI</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    expandedSections.includes("border") && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  <ColorPicker
                    label="Border"
                    value={customization.borderColor}
                    onChange={(value) => setCustomization({ borderColor: value })}
                    description="Borders and dividers"
                  />
                  <ColorPicker
                    label="Muted Background"
                    value={customization.mutedColor}
                    onChange={(value) => setCustomization({ mutedColor: value })}
                    description="Disabled and subtle backgrounds"
                  />
                  <ColorPicker
                    label="Input Background"
                    value={customization.inputColor}
                    onChange={(value) => setCustomization({ inputColor: value })}
                    description="Form input borders"
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6">
              {/* Dark Mode Colors */}
              <Collapsible 
                open={expandedSections.includes("dark")}
                onOpenChange={() => toggleSection("dark")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-primary" />
                    <span className="font-medium">Dark Mode Overrides</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    expandedSections.includes("dark") && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  <ColorPicker
                    label="Dark Background"
                    value={customization.darkBackgroundColor}
                    onChange={(value) => setCustomization({ darkBackgroundColor: value })}
                    description="Background color in dark mode"
                  />
                  <ColorPicker
                    label="Dark Component"
                    value={customization.darkComponentColor}
                    onChange={(value) => setCustomization({ darkComponentColor: value })}
                    description="Card/component color in dark mode"
                  />
                  <ColorPicker
                    label="Dark Text"
                    value={customization.darkTextColor}
                    onChange={(value) => setCustomization({ darkTextColor: value })}
                    description="Text color in dark mode"
                  />
                  <ColorPicker
                    label="Dark Sidebar"
                    value={customization.darkSidebarColor}
                    onChange={(value) => setCustomization({ darkSidebarColor: value })}
                    description="Sidebar color in dark mode"
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Background Style */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Layout className="h-4 w-4 text-primary" />
                  Background Style
                </Label>
                <Select
                  value={customization.backgroundStyle}
                  onValueChange={(value: BackgroundStyle) => setCustomization({ backgroundStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="gradient">Soft Gradient</SelectItem>
                    <SelectItem value="mesh">Gradient Mesh</SelectItem>
                    <SelectItem value="pattern">Subtle Pattern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Border Radius */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-primary" />
                  Border Radius
                </Label>
                <Select
                  value={customization.borderRadius}
                  onValueChange={(value: BorderRadius) => setCustomization({ borderRadius: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Sharp corners)</SelectItem>
                    <SelectItem value="small">Small (0.25rem)</SelectItem>
                    <SelectItem value="medium">Medium (0.5rem)</SelectItem>
                    <SelectItem value="large">Large (0.75rem)</SelectItem>
                    <SelectItem value="full">Extra Large (1rem)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              <div className="space-y-3">
                <Label>Preview</Label>
                <div 
                  className="p-4 rounded-lg border-2"
                  style={{ 
                    backgroundColor: customization.backgroundColor,
                    borderColor: customization.borderColor 
                  }}
                >
                  <div 
                    className="p-4 rounded-md mb-3"
                    style={{ 
                      backgroundColor: customization.componentColor,
                      borderRadius: customization.borderRadius === "none" ? "0" : 
                                   customization.borderRadius === "small" ? "0.25rem" :
                                   customization.borderRadius === "medium" ? "0.5rem" :
                                   customization.borderRadius === "large" ? "0.75rem" : "1rem"
                    }}
                  >
                    <div 
                      className="text-sm font-medium mb-2"
                      style={{ color: customization.textColor }}
                    >
                      Card Component
                    </div>
                    <div className="flex gap-2">
                      <div 
                        className="px-3 py-1 rounded text-xs text-white"
                        style={{ backgroundColor: customization.primaryColor }}
                      >
                        Primary
                      </div>
                      <div 
                        className="px-3 py-1 rounded text-xs"
                        style={{ 
                          backgroundColor: customization.accentColor,
                          color: customization.textColor 
                        }}
                      >
                        Accent
                      </div>
                    </div>
                  </div>
                  <div 
                    className="flex gap-2"
                    style={{ color: customization.textColor }}
                  >
                    <div 
                      className="w-12 h-full rounded p-2 text-center text-xs"
                      style={{ 
                        backgroundColor: customization.sidebarColor,
                        color: customization.sidebarTextColor 
                      }}
                    >
                      Nav
                    </div>
                    <div className="flex-1 text-xs opacity-60">
                      Content area preview
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-background space-y-3">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={resetToDefault}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    size="icon"
                    onClick={copyThemeConfig}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy theme config</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
