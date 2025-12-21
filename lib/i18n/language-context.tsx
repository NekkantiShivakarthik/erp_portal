"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Import all translations
import en from '@/messages/en.json'
import kn from '@/messages/kn.json'
import te from '@/messages/te.json'

// Add Tamil translations
const ta = {
  header: {
    welcomeBack: "மீண்டும் வரவேற்கிறோம்",
    notifications: "அறிவிப்புகள்",
    infraApproved: "உள்கட்டமைப்பு கோரிக்கை அங்கீகரிக்கப்பட்டது",
    infraApprovedDesc: "10 புதிய பெஞ்சுகளுக்கான உங்கள் கோரிக்கை அங்கீகரிக்கப்பட்டது",
    newTraining: "புதிய பயிற்சி பட்டறை",
    newTrainingDesc: "டிஜிட்டல் கற்பித்தல் முறைகள் - டிசம்பர் 20, 2024",
    attendanceReminder: "வருகைப்பதிவு நினைவூட்டல்",
    attendanceReminderDesc: "இன்றைய வருகைப்பதிவை மாலை 3:00 மணிக்குள் புதுப்பிக்கவும்",
    monthlyReportDue: "மாதாந்திர அறிக்கை நிலுவையில்",
    monthlyReportDueDesc: "டிசம்பர் 15க்குள் உங்கள் வகுப்பறை அறிக்கையை சமர்ப்பிக்கவும்",
    myProfile: "என் சுயவிவரம்",
    helpSupport: "உதவி & ஆதரவு",
    logout: "வெளியேறு",
    educationPortal: "கல்வி போர்டல்"
  },
  student: {
    dashboard: "மாணவர் டாஷ்போர்டு",
    viewAttendance: "உங்கள் வருகைப்பதிவைப் பார்க்கவும் மற்றும் கற்றல் வளங்களை அணுகவும்",
    information: "மாணவர் தகவல்",
    myAttendance: "என் வருகைப்பதிவு",
    attendanceRate: "வருகை விகிதம்",
    presentDays: "வந்த நாட்கள்",
    absentDays: "வராத நாட்கள்",
    lateArrivals: "தாமதமாக வருகை",
    last30Days: "கடந்த 30 நாட்கள்",
    attendanceHistory: "வருகை வரலாறு",
    noAttendanceData: "வருகை தரவு இல்லை",
    present: "வந்தது",
    absent: "வரவில்லை",
    late: "தாமதம்",
    learningResources: "கற்றல் வளங்கள்",
    viewAllResources: "அனைத்து வளங்களையும் பார்க்க",
    studyMaterials: "படிப்பு பொருட்கள்",
    studyMaterialsDesc: "பாடப்புத்தகங்கள், குறிப்புகள் மற்றும் படிப்பு வழிகாட்டிகளை அணுகவும்",
    browseMaterials: "பொருட்களை உலாவுக",
    videoLessons: "வீடியோ பாடங்கள்",
    videoLessonsDesc: "கல்வி வீடியோக்கள் மற்றும் பயிற்சிகளைப் பாருங்கள்",
    watchVideos: "வீடியோக்களைப் பார்க்க",
    practiceTests: "பயிற்சி தேர்வுகள்",
    practiceTestsDesc: "வினாடி வினாக்கள் மற்றும் பயிற்சி தேர்வுகளை எழுதுங்கள்",
    startPractice: "பயிற்சி தொடங்கு",
    infrastructureReports: "உள்கட்டமைப்பு அறிக்கைகள்",
    schoolInfrastructure: "பள்ளி உள்கட்டமைப்பு",
    infrastructureDesc: "உங்கள் பள்ளியின் உள்கட்டமைப்பு சிக்கல்கள் மற்றும் பழுது நிலையைப் பாருங்கள்.",
    viewInfrastructureReports: "உள்கட்டமைப்பு அறிக்கைகளைப் பார்க்க"
  },
  resources: {
    title: "கற்றல் வளங்கள்",
    description: "படிப்பு பொருட்கள், வீடியோக்கள் மற்றும் பயிற்சி தேர்வுகளை அணுகவும்",
    searchPlaceholder: "வளங்களைத் தேடு...",
    filter: "வடிகட்டி",
    studyMaterials: "படிப்பு பொருட்கள்",
    videoLessons: "வீடியோ பாடங்கள்",
    practiceTests: "பயிற்சி தேர்வுகள்",
    resourceCount: "{count} வளங்கள்",
    videoCount: "{count} வீடியோக்கள்",
    testCount: "{count} தேர்வுகள்",
    allResources: "அனைத்து வளங்கள்",
    watch: "பார்",
    download: "பதிவிறக்கு",
    needHelp: "உதவி வேண்டுமா?",
    contactTeacher: "ஆசிரியரைத் தொடர்புகொள்ள",
    contactTeacherButton: "ஆசிரியரைத் தொடர்புகொள்ள",
    resources: "வளங்கள்",
    videos: "வீடியோக்கள்",
    tests: "தேர்வுகள்",
    helpDescription: "கூடுதல் வளங்கள் தேவைப்பட்டால் உங்கள் ஆசிரியரைத் தொடர்புகொள்ளுங்கள்"
  },
  infrastructure: {
    title: "உள்கட்டமைப்பு அறிக்கைகள்",
    viewIssues: "உங்கள் பள்ளியில் புகாரளிக்கப்பட்ட உள்கட்டமைப்பு சிக்கல்களைப் பாருங்கள்",
    infoMessage: "இந்தப் பக்கம் உங்கள் பள்ளியின் உள்கட்டமைப்பு சிக்கல்களைக் காட்டுகிறது. உங்கள் பெற்றோர்களும் இந்தத் தகவலை அணுகலாம்.",
    totalIssues: "மொத்த சிக்கல்கள்",
    pending: "நிலுவையில்",
    inProgress: "நடைபெறுகிறது",
    resolved: "தீர்க்கப்பட்டது",
    allReported: "புகாரளிக்கப்பட்ட அனைத்து சிக்கல்கள்",
    awaitingAction: "நடவடிக்கை எதிர்பார்ப்பு",
    beingFixed: "சரிசெய்யப்படுகிறது",
    completed: "முடிந்தது",
    infrastructureIssues: "உள்கட்டமைப்பு சிக்கல்கள்",
    currentAndPast: "உங்கள் பள்ளியின் தற்போதைய மற்றும் கடந்த உள்கட்டமைப்பு பிரச்சனைகள்",
    noIssues: "சிக்கல்கள் எதுவும் புகாரளிக்கப்படவில்லை",
    greatNews: "நல்ல செய்தி! உங்கள் பள்ளிக்கு உள்கட்டமைப்பு சிக்கல்கள் எதுவும் புகாரளிக்கப்படவில்லை.",
    priority: "முன்னுரிமை",
    highPriority: "அதிக முன்னுரிமை",
    mediumPriority: "நடுத்தர முன்னுரிமை",
    lowPriority: "குறைந்த முன்னுரிமை"
  },
  common: {
    name: "பெயர்",
    rollNo: "ரோல் எண்",
    school: "பள்ளி",
    loading: "ஏற்றுகிறது...",
    days: "நாட்கள்",
    dashboard: "டாஷ்போர்டு",
    help: "உதவி",
    logout: "வெளியேறு",
    settings: "அமைப்புகள்"
  },
  sidebar: {
    student: "மாணவர் நிர்வாகம்",
    studentMenu: "மாணவர் மெனு",
    teacherMenu: "ஆசிரியர் மெனு",
    dashboard: "டாஷ்போர்டு",
    learningResources: "கற்றல் வளங்கள்",
    infrastructureReports: "உள்கட்டமைப்பு அறிக்கைகள்",
    attendance: "வருகைப்பதிவு",
    classroomChallenges: "வகுப்பறை சவால்கள்",
    teachingResources: "கற்பித்தல் வளங்கள்",
    trainingWorkshops: "பயிற்சி பட்டறைகள்",
    infrastructure: "உள்கட்டமைப்பு",
    infrastructureStatus: "உள்கட்டமைப்பு நிலை",
    reportIssues: "சிக்கல்களைப் புகாரளி",
    trackRequests: "கோரிக்கைகளைக் கண்காணி",
    management: "நிர்வாகம்",
    monitoringPanel: "கண்காணிப்பு பேனல்",
    fundAllocation: "நிதி ஒதுக்கீடு",
    reports: "அறிக்கைகள்"
  },
  teacher: {
    dashboard: "ஆசிரியர் டாஷ்போர்டு",
    welcome: "வரவேற்கிறோம்",
    attendance: "வருகைப்பதிவு",
    markAttendance: "வருகைப்பதிவு குறிக்க",
    challenges: "வகுப்பறை சவால்கள்",
    resources: "கற்பித்தல் வளங்கள்",
    training: "பயிற்சி பட்டறைகள்"
  }
}

const translations: Record<string, Record<string, any>> = {
  en,
  kn,
  te,
  ta
}

interface LanguageContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string) => string
  translations: Record<string, any>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
]

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en'
    setLocaleState(savedLocale)
    setMounted(true)
  }, [])

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    // Dispatch event for other components to update
    window.dispatchEvent(new CustomEvent('localeChange', { detail: newLocale }))
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale] || translations['en']
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  const currentTranslations = (translations[locale] || translations['en']) as Record<string, any>

  // Always provide the context, even before mounting (use default 'en' locale)
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, translations: currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
