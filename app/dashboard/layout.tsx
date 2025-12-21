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
        <div className="flex min-h-screen w-full">
          <SidebarNav />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 overflow-auto gradient-mesh-bg p-6 relative">
              <div className="floating-icons-bg absolute inset-0 pointer-events-none" />
              <div className="relative z-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </LanguageProvider>
  )
}
