"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { ThemeColorProvider } from "@/lib/theme-colors"
import { ThemeCustomizerProvider } from "@/lib/theme-customizer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeCustomizerProvider>
      <ThemeColorProvider>
        <LanguageProvider>
          <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <SidebarNav />
            <div className="flex flex-1 flex-col">
              <Header />
              <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6 lg:p-8">
                <div className="animate-fade-in-up max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
          </SidebarProvider>
        </LanguageProvider>
      </ThemeColorProvider>
    </ThemeCustomizerProvider>
  )
}
