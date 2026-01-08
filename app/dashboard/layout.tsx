"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { LanguageProvider } from "@/lib/i18n/language-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-pink-50/50 via-background to-purple-50/30 dark:from-pink-950/20 dark:via-background dark:to-purple-950/20">
          <SidebarNav />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 overflow-auto gradient-mesh-bg p-4 md:p-6 lg:p-8 relative">
              <div className="floating-icons-bg absolute inset-0 pointer-events-none opacity-40" />
              <div className="relative z-10 animate-fade-in-up max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </LanguageProvider>
  )
}
