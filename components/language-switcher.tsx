"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLanguage, languages } from "@/lib/i18n/language-context"

// Language icons/flags as emoji
const languageIcons: Record<string, string> = {
  en: "🇬🇧",
  kn: "🇮🇳",
  te: "🇮🇳",
  ta: "🇮🇳",
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  
  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent">
          <Globe className="h-4 w-4 text-orange-500" />
          <span className="text-lg">{languageIcons[locale] || "🌐"}</span>
          <span className="hidden sm:inline font-medium">{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLocale(language.code)}
            className={`cursor-pointer ${locale === language.code ? "bg-accent" : ""}`}
          >
            <span className="text-lg mr-2">{languageIcons[language.code]}</span>
            <span className="font-medium">{language.nativeName}</span>
            <span className="ml-auto text-xs text-muted-foreground">({language.name})</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
