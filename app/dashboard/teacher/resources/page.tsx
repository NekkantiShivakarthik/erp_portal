"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { 
  BookOpen, 
  FileText,
  Download,
  Search,
  Star,
  GraduationCap,
  Calculator,
  FlaskConical,
  Globe,
  BookMarked,
  ExternalLink,
  BookOpenCheck,
  Play,
  PlayCircle,
  Youtube,
  Clock,
  Eye
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

// Educational Videos for Students - Class 6 to 10 (Physics Wallah & Other Channels)
const videos = [
  // Class 6 Videos - Physics Wallah (Real verified URLs)
  { id: 1, title: "Knowing Our Numbers Full Chapter", subject: "Mathematics", class: "Class 6", chapter: "Chapter 1", views: 3500000, duration: "1:15:30", thumbnail: "🔢", videoUrl: "https://www.youtube.com/watch?v=4OvGeKbi6UM", channel: "Physics Wallah" },
  { id: 2, title: "Integers Class 6 Complete", subject: "Mathematics", class: "Class 6", chapter: "Chapter 6", views: 2800000, duration: "1:08:45", thumbnail: "➕", videoUrl: "https://www.youtube.com/watch?v=Z1jFXrOLHRA", channel: "Physics Wallah" },
  { id: 3, title: "Fractions Full Chapter Class 6", subject: "Mathematics", class: "Class 6", chapter: "Chapter 7", views: 2400000, duration: "1:22:30", thumbnail: "🔣", videoUrl: "https://www.youtube.com/watch?v=0t4TsZvFMvQ", channel: "Physics Wallah" },
  { id: 4, title: "Ratio and Proportion Full Chapter", subject: "Mathematics", class: "Class 6", chapter: "Chapter 12", views: 2100000, duration: "58:20", thumbnail: "📐", videoUrl: "https://www.youtube.com/watch?v=5wDF_RZMVZ0", channel: "Physics Wallah" },
  { id: 5, title: "The Other Side of Zero", subject: "Mathematics", class: "Class 6", chapter: "Chapter 10", views: 3200000, duration: "45:15", thumbnail: "➖", videoUrl: "https://www.youtube.com/watch?v=m9JHftKXDXc", channel: "Physics Wallah" },
  { id: 6, title: "Symmetry Class 6 Complete", subject: "Mathematics", class: "Class 6", chapter: "Chapter 13", views: 2900000, duration: "52:40", thumbnail: "🔶", videoUrl: "https://www.youtube.com/watch?v=Yhl1MFtt3sQ", channel: "Physics Wallah" },
  { id: 7, title: "Methods of Separation in Everyday Life", subject: "Science", class: "Class 6", chapter: "Chapter 5", views: 2600000, duration: "48:30", thumbnail: "🧪", videoUrl: "https://www.youtube.com/watch?v=HWbPymLZrqs", channel: "Physics Wallah" },
  { id: 8, title: "Unity in Diversity Many in One", subject: "Social Science", class: "Class 6", chapter: "Chapter 1", views: 2300000, duration: "42:15", thumbnail: "🌍", videoUrl: "https://www.youtube.com/watch?v=OIZKV26uzPQ", channel: "Physics Wallah" },
  { id: 9, title: "What a Bird Thought", subject: "English", class: "Class 6", chapter: "Chapter 7", views: 4500000, duration: "55:30", thumbnail: "🐦", videoUrl: "https://www.youtube.com/watch?v=j1dhdUOVC6I", channel: "Physics Wallah" },
  { id: 10, title: "Algebra Cheat Sheet Class 6", subject: "Mathematics", class: "Class 6", chapter: "Chapter 11", views: 3800000, duration: "45:00", thumbnail: "📊", videoUrl: "https://www.youtube.com/watch?v=m0TtI2H5qpA", channel: "Physics Wallah" },
  
  // Class 7 Videos - Physics Wallah (Verified)
  { id: 11, title: "Rational Numbers One Shot Class 7", subject: "Mathematics", class: "Class 7", chapter: "Chapter 1", views: 3200000, duration: "1:25:30", thumbnail: "🔢", videoUrl: "https://www.youtube.com/watch?v=iLSzMsXcvlQ", channel: "Physics Wallah" },
  
  // Class 9 Videos - Physics Wallah (Verified)
  { id: 12, title: "Number Systems Class 9 One Shot", subject: "Mathematics", class: "Class 9", chapter: "Chapter 1", views: 8900000, duration: "1:45:30", thumbnail: "🔢", videoUrl: "https://www.youtube.com/watch?v=xn2HskGqSkI", channel: "Physics Wallah" },
  { id: 13, title: "Complete Class 9th MATHS Marathon", subject: "Mathematics", class: "Class 9", chapter: "All Chapters", views: 6500000, duration: "5:38:45", thumbnail: "📊", videoUrl: "https://www.youtube.com/watch?v=35IP0ggmkjM", channel: "Physics Wallah" },
  { id: 14, title: "Number System Class 9 Free Class", subject: "Mathematics", class: "Class 9", chapter: "Chapter 1", views: 5800000, duration: "1:28:30", thumbnail: "📍", videoUrl: "https://www.youtube.com/watch?v=9ZaxD5_Sosg", channel: "Physics Wallah" },
  { id: 15, title: "Lines and Angles ONE SHOT Class 9", subject: "Mathematics", class: "Class 9", chapter: "Chapter 6", views: 6200000, duration: "1:52:45", thumbnail: "📐", videoUrl: "https://www.youtube.com/watch?v=42u_1PKQ1gM", channel: "Physics Wallah" },
  { id: 16, title: "Lines and Angles Full Chapter", subject: "Mathematics", class: "Class 9", chapter: "Chapter 6", views: 4500000, duration: "1:15:30", thumbnail: "📏", videoUrl: "https://www.youtube.com/watch?v=Ab85MNomGrk", channel: "Physics Wallah" },
  { id: 17, title: "Lines and Angles One Shot 2025", subject: "Mathematics", class: "Class 9", chapter: "Chapter 6", views: 5200000, duration: "1:42:20", thumbnail: "∠", videoUrl: "https://www.youtube.com/watch?v=_2A9vbVsfCc", channel: "Physics Wallah" },
  { id: 18, title: "Triangles One Shot Class 9", subject: "Mathematics", class: "Class 9", chapter: "Chapter 7", views: 6800000, duration: "1:55:30", thumbnail: "🔺", videoUrl: "https://www.youtube.com/watch?v=FnVgE5IF9jc", channel: "Physics Wallah" },
  { id: 19, title: "Number Systems Full Chapter Class 9", subject: "Mathematics", class: "Class 9", chapter: "Chapter 1", views: 5100000, duration: "1:38:45", thumbnail: "🔷", videoUrl: "https://www.youtube.com/watch?v=KBBIuIR-vd4", channel: "Physics Wallah" },
  { id: 20, title: "Number System ONE SHOT NEEV", subject: "Mathematics", class: "Class 9", chapter: "Chapter 1", views: 7200000, duration: "2:05:30", thumbnail: "⭕", videoUrl: "https://www.youtube.com/watch?v=mvJNnu5cLVQ", channel: "Physics Wallah" },
  { id: 21, title: "Lines and Angles English Medium", subject: "Mathematics", class: "Class 9", chapter: "Chapter 6", views: 4800000, duration: "1:22:15", thumbnail: "📐", videoUrl: "https://www.youtube.com/watch?v=gHlH1sPZwwk", channel: "Physics Wallah" },
  
  // Class 10 Videos - Physics Wallah (Verified URLs)
  { id: 22, title: "Chemical Reactions & Equations ONE SHOT", subject: "Science", class: "Class 10", chapter: "Chapter 1", views: 15000000, duration: "1:28:20", thumbnail: "⚗️", videoUrl: "https://www.youtube.com/watch?v=g1p-5XcHRCs", channel: "Physics Wallah" },
  { id: 23, title: "Chemical Reactions Complete Chapter", subject: "Science", class: "Class 10", chapter: "Chapter 1", views: 12000000, duration: "1:35:45", thumbnail: "🧪", videoUrl: "https://www.youtube.com/watch?v=JJD14urpQg4", channel: "Physics Wallah" },
  { id: 24, title: "Metals & Non Metals ONE SHOT", subject: "Science", class: "Class 10", chapter: "Chapter 3", views: 9800000, duration: "1:52:30", thumbnail: "🔩", videoUrl: "https://www.youtube.com/watch?v=z9jjzixnc6I", channel: "Physics Wallah" },
  { id: 25, title: "Carbon and Its Compounds ONE SHOT", subject: "Science", class: "Class 10", chapter: "Chapter 4", views: 11500000, duration: "1:45:15", thumbnail: "⬛", videoUrl: "https://www.youtube.com/watch?v=LUfVHSbWcts", channel: "Physics Wallah" },
  { id: 26, title: "Life Processes ONE SHOT Line by Line", subject: "Science", class: "Class 10", chapter: "Chapter 6", views: 10200000, duration: "1:38:30", thumbnail: "🫀", videoUrl: "https://www.youtube.com/watch?v=a3klf9QIUg8", channel: "Physics Wallah" },
  { id: 27, title: "Life Processes in 60 Minutes", subject: "Science", class: "Class 10", chapter: "Chapter 6", views: 8900000, duration: "1:00:00", thumbnail: "🧬", videoUrl: "https://www.youtube.com/watch?v=caSwA2fNMrA", channel: "Physics Wallah" },
  { id: 28, title: "Our Environment ONE SHOT", subject: "Science", class: "Class 10", chapter: "Chapter 13", views: 7800000, duration: "1:42:30", thumbnail: "🌿", videoUrl: "https://www.youtube.com/watch?v=1G0HrVNlsuY", channel: "Physics Wallah" },
  { id: 29, title: "Electricity Complete Chapter", subject: "Science", class: "Class 10", chapter: "Chapter 12", views: 18000000, duration: "2:25:40", thumbnail: "⚡", videoUrl: "https://www.youtube.com/watch?v=Gdu2MsTDhsA", channel: "Physics Wallah" },
  { id: 30, title: "Sources of Energy in 1 Shot", subject: "Science", class: "Class 10", chapter: "Chapter 14", views: 9500000, duration: "1:35:20", thumbnail: "🔋", videoUrl: "https://www.youtube.com/watch?v=qxeLv49wvmU", channel: "Physics Wallah" },
  
  // NEET Physics Crash Course - Class 11 & 12 Physics by Physics Wallah (Verified URLs from playlist)
  { id: 31, title: "Basic Mathematics | Trignometry | Differentiation n Integration", subject: "Physics", class: "Class 11", chapter: "Basic Maths", views: 5000000, duration: "2:30:00", thumbnail: "📐", videoUrl: "https://www.youtube.com/watch?v=zY38SV2BW7k", channel: "Physics Wallah" },
  { id: 32, title: "KINEMATICS 01 - Motion in a Straight Line | 1-D Motion", subject: "Physics", class: "Class 11", chapter: "Kinematics", views: 4500000, duration: "2:15:00", thumbnail: "🚗", videoUrl: "https://www.youtube.com/watch?v=eQhOAHMankc", channel: "Physics Wallah" },
  { id: 33, title: "KINEMATICS 02 - Galileo's Law, Vectors, Relative Velocity", subject: "Physics", class: "Class 11", chapter: "Kinematics", views: 4200000, duration: "2:20:00", thumbnail: "➡️", videoUrl: "https://www.youtube.com/watch?v=O_baUve-kB8", channel: "Physics Wallah" },
  { id: 34, title: "KINEMATICS 03 - Relative Velocity 2-D | Rain Man River Problem", subject: "Physics", class: "Class 11", chapter: "Kinematics", views: 3800000, duration: "2:10:00", thumbnail: "🌧️", videoUrl: "https://www.youtube.com/watch?v=Gx2YbcfpVkI", channel: "Physics Wallah" },
  { id: 35, title: "KINEMATICS 04 - PROJECTILE MOTION One Shot", subject: "Physics", class: "Class 11", chapter: "Kinematics", views: 5200000, duration: "2:45:00", thumbnail: "🎯", videoUrl: "https://www.youtube.com/watch?v=64XCP66W8kQ", channel: "Physics Wallah" },
  { id: 36, title: "LAWS OF MOTION 01 - First & Second Law One Shot", subject: "Physics", class: "Class 11", chapter: "Laws of Motion", views: 4800000, duration: "2:30:00", thumbnail: "⚖️", videoUrl: "https://www.youtube.com/watch?v=M3RBYFLSW0Y", channel: "Physics Wallah" },
  { id: 37, title: "LAWS OF MOTION 02 - Spring Force, Pseudo Force, Rocket", subject: "Physics", class: "Class 11", chapter: "Laws of Motion", views: 4100000, duration: "2:25:00", thumbnail: "🚀", videoUrl: "https://www.youtube.com/watch?v=iSI0GZc50pI", channel: "Physics Wallah" },
  { id: 38, title: "FRICTION in One Shot - All Concepts & PYQs", subject: "Physics", class: "Class 11", chapter: "Friction", views: 5500000, duration: "2:40:00", thumbnail: "🛞", videoUrl: "https://www.youtube.com/watch?v=4ygO9IonVKY", channel: "Physics Wallah" },
  { id: 39, title: "CIRCULAR MOTION 01 - Centripetal Acceleration & Force", subject: "Physics", class: "Class 11", chapter: "Circular Motion", views: 4300000, duration: "2:15:00", thumbnail: "🔄", videoUrl: "https://www.youtube.com/watch?v=yzQfaX9EH9w", channel: "Physics Wallah" },
  { id: 40, title: "CIRCULAR MOTION 02 - Banking of Road, Vertical Circle", subject: "Physics", class: "Class 11", chapter: "Circular Motion", views: 3900000, duration: "2:20:00", thumbnail: "🛣️", videoUrl: "https://www.youtube.com/watch?v=vZWlpp5Glx4", channel: "Physics Wallah" },
  { id: 41, title: "WORK ENERGY POWER 01 - Work, Kinetic Energy", subject: "Physics", class: "Class 11", chapter: "Work Energy Power", views: 5100000, duration: "2:35:00", thumbnail: "💪", videoUrl: "https://www.youtube.com/watch?v=8dRPzktsaU8", channel: "Physics Wallah" },
  { id: 42, title: "WORK ENERGY POWER 02 - Conservation of Energy, Power", subject: "Physics", class: "Class 11", chapter: "Work Energy Power", views: 4600000, duration: "2:25:00", thumbnail: "⚡", videoUrl: "https://www.youtube.com/watch?v=Uvu3zw_XrEY", channel: "Physics Wallah" },
  { id: 43, title: "CENTRE OF MASS One Shot - All Concepts & PYQs", subject: "Physics", class: "Class 11", chapter: "Centre of Mass", views: 4200000, duration: "2:45:00", thumbnail: "⚖️", videoUrl: "https://www.youtube.com/watch?v=jbFcxEA0T84", channel: "Physics Wallah" },
  { id: 44, title: "COLLISIONS in One Shot - All Concepts & PYQs", subject: "Physics", class: "Class 11", chapter: "Collisions", views: 3800000, duration: "2:30:00", thumbnail: "💥", videoUrl: "https://www.youtube.com/watch?v=WzsSOqYLFQg", channel: "Physics Wallah" },
  { id: 45, title: "ROTATIONAL MOTION 01 - Torque & Moment of Inertia", subject: "Physics", class: "Class 11", chapter: "Rotational Motion", views: 5300000, duration: "2:50:00", thumbnail: "🔄", videoUrl: "https://www.youtube.com/watch?v=KrwlGHOCjxQ", channel: "Physics Wallah" },
  { id: 46, title: "ROTATIONAL MOTION 02 - Complete Chapter", subject: "Physics", class: "Class 11", chapter: "Rotational Motion", views: 4700000, duration: "2:40:00", thumbnail: "⚙️", videoUrl: "https://www.youtube.com/watch?v=t2pKh2Abq-Y", channel: "Physics Wallah" },
  { id: 47, title: "GRAVITATION in One Shot - All Concepts & PYQs", subject: "Physics", class: "Class 11", chapter: "Gravitation", views: 6200000, duration: "3:15:00", thumbnail: "🌍", videoUrl: "https://www.youtube.com/watch?v=IJAdPbSY2Ww", channel: "Physics Wallah" },
  
  // Class 12 Physics - NEET Crash Course
  { id: 48, title: "ELECTRIC CHARGES AND FIELDS One Shot", subject: "Physics", class: "Class 12", chapter: "Electrostatics", views: 8500000, duration: "7:30:00", thumbnail: "⚡", videoUrl: "https://www.youtube.com/watch?v=iXHC9Qjl924", channel: "Physics Wallah" },
  { id: 49, title: "ELECTRIC POTENTIAL & ENERGY One Shot", subject: "Physics", class: "Class 12", chapter: "Electrostatics", views: 6200000, duration: "3:50:00", thumbnail: "🔋", videoUrl: "https://www.youtube.com/watch?v=suj97hdgcSs", channel: "Physics Wallah" },
  { id: 50, title: "CAPACITORS in One Shot - All Concepts & PYQs", subject: "Physics", class: "Class 12", chapter: "Capacitors", views: 5800000, duration: "4:50:00", thumbnail: "🔌", videoUrl: "https://www.youtube.com/watch?v=Q37hPauyMsk", channel: "Physics Wallah" },
  { id: 51, title: "CURRENT ELECTRICITY Part 1 - Complete Chapter", subject: "Physics", class: "Class 12", chapter: "Current Electricity", views: 7200000, duration: "6:25:00", thumbnail: "💡", videoUrl: "https://www.youtube.com/watch?v=OPlHTsn7lsg", channel: "Physics Wallah" },
  { id: 52, title: "CURRENT ELECTRICITY Part 2 - All PYQs", subject: "Physics", class: "Class 12", chapter: "Current Electricity", views: 5500000, duration: "4:30:00", thumbnail: "🔌", videoUrl: "https://www.youtube.com/watch?v=nyyeab-BVDo", channel: "Physics Wallah" },
  { id: 53, title: "MOVING CHARGES AND MAGNETISM One Shot", subject: "Physics", class: "Class 12", chapter: "Magnetism", views: 6800000, duration: "8:00:00", thumbnail: "🧲", videoUrl: "https://www.youtube.com/watch?v=5VLsi3Kql6A", channel: "Physics Wallah" },
  { id: 54, title: "MAGNETISM AND MATTER One Shot", subject: "Physics", class: "Class 12", chapter: "Magnetism", views: 4500000, duration: "4:00:00", thumbnail: "🧭", videoUrl: "https://www.youtube.com/watch?v=AN0Rd6ALfqw", channel: "Physics Wallah" },
  { id: 55, title: "ELECTROMAGNETIC INDUCTION - EMI One Shot", subject: "Physics", class: "Class 12", chapter: "EMI", views: 5900000, duration: "5:30:00", thumbnail: "⚡", videoUrl: "https://www.youtube.com/watch?v=NbMhzKhcaE0", channel: "Physics Wallah" },
  { id: 56, title: "ALTERNATING CURRENT - AC One Shot", subject: "Physics", class: "Class 12", chapter: "AC Circuits", views: 6100000, duration: "5:30:00", thumbnail: "〰️", videoUrl: "https://www.youtube.com/watch?v=hLRk0t6m8a8", channel: "Physics Wallah" },
  { id: 57, title: "ELECTROMAGNETIC WAVES - EMW One Shot", subject: "Physics", class: "Class 12", chapter: "EMW", views: 3800000, duration: "2:45:00", thumbnail: "📡", videoUrl: "https://www.youtube.com/watch?v=ozxCRMct-ko", channel: "Physics Wallah" },
  { id: 58, title: "RAY OPTICS Part 1 - All Concepts & PYQs", subject: "Physics", class: "Class 12", chapter: "Ray Optics", views: 7500000, duration: "4:15:00", thumbnail: "🔦", videoUrl: "https://www.youtube.com/watch?v=2GAM23QB8D0", channel: "Physics Wallah" },
  { id: 59, title: "RAY OPTICS Part 2 - Complete Chapter", subject: "Physics", class: "Class 12", chapter: "Ray Optics", views: 5200000, duration: "5:00:00", thumbnail: "🔍", videoUrl: "https://www.youtube.com/watch?v=RP_W9xrYgYw", channel: "Physics Wallah" },
  { id: 60, title: "WAVE OPTICS in One Shot - All Concepts", subject: "Physics", class: "Class 12", chapter: "Wave Optics", views: 5800000, duration: "4:30:00", thumbnail: "🌈", videoUrl: "https://www.youtube.com/watch?v=0XTuH87yySI", channel: "Physics Wallah" },
  { id: 61, title: "DUAL NATURE OF RADIATION & MATTER One Shot", subject: "Physics", class: "Class 12", chapter: "Modern Physics", views: 4900000, duration: "3:45:00", thumbnail: "⚛️", videoUrl: "https://www.youtube.com/watch?v=7Tfg3d-1MDY", channel: "Physics Wallah" },
  { id: 62, title: "ATOMS AND NUCLEI - Complete Chapter", subject: "Physics", class: "Class 12", chapter: "Nuclear Physics", views: 5500000, duration: "4:20:00", thumbnail: "☢️", videoUrl: "https://www.youtube.com/watch?v=qQ5FfYMTql4", channel: "Physics Wallah" },
  { id: 63, title: "SEMICONDUCTORS in One Shot - All Concepts", subject: "Physics", class: "Class 12", chapter: "Semiconductors", views: 4200000, duration: "3:30:00", thumbnail: "🔲", videoUrl: "https://www.youtube.com/watch?v=4Zk4W7gfCQw", channel: "Physics Wallah" },
  { id: 64, title: "UNITS AND DIMENSIONS One Shot", subject: "Physics", class: "Class 11", chapter: "Units & Dimensions", views: 6500000, duration: "3:35:00", thumbnail: "📏", videoUrl: "https://www.youtube.com/watch?v=INCGLmdg60M", channel: "Physics Wallah" },
]

// Notes/Study Materials Data
const notes = [
  // Class 6 Notes
  { id: 1, title: "Knowing Our Numbers", subject: "Mathematics", class: "Class 6", chapter: "Chapter 1", downloads: 567, rating: 4.9, size: "1.2 MB", language: "English" },
  { id: 2, title: "Whole Numbers", subject: "Mathematics", class: "Class 6", chapter: "Chapter 2", downloads: 534, rating: 4.8, size: "1.1 MB", language: "English" },
  { id: 3, title: "Playing with Numbers", subject: "Mathematics", class: "Class 6", chapter: "Chapter 3", downloads: 512, rating: 4.8, size: "1.3 MB", language: "English" },
  { id: 4, title: "Food: Where Does It Come From", subject: "Science", class: "Class 6", chapter: "Chapter 1", downloads: 489, rating: 4.8, size: "1.5 MB", language: "English" },
  { id: 5, title: "Components of Food", subject: "Science", class: "Class 6", chapter: "Chapter 2", downloads: 467, rating: 4.7, size: "1.4 MB", language: "English" },
  { id: 6, title: "Fibre to Fabric", subject: "Science", class: "Class 6", chapter: "Chapter 3", downloads: 445, rating: 4.7, size: "1.3 MB", language: "English" },
  { id: 7, title: "What, Where, How and When?", subject: "Social Science", class: "Class 6", chapter: "History Ch-1", downloads: 423, rating: 4.7, size: "1.2 MB", language: "English" },
  { id: 8, title: "The Earth in the Solar System", subject: "Social Science", class: "Class 6", chapter: "Geography Ch-1", downloads: 398, rating: 4.6, size: "1.3 MB", language: "English" },
  { id: 9, title: "Who Did Patrick's Homework?", subject: "English", class: "Class 6", chapter: "Chapter 1", downloads: 456, rating: 4.7, size: "0.8 MB", language: "English" },
  
  // Class 7 Notes
  { id: 10, title: "Integers", subject: "Mathematics", class: "Class 7", chapter: "Chapter 1", downloads: 678, rating: 4.9, size: "1.4 MB", language: "English" },
  { id: 11, title: "Fractions and Decimals", subject: "Mathematics", class: "Class 7", chapter: "Chapter 2", downloads: 645, rating: 4.8, size: "1.5 MB", language: "English" },
  { id: 12, title: "Data Handling", subject: "Mathematics", class: "Class 7", chapter: "Chapter 3", downloads: 612, rating: 4.8, size: "1.3 MB", language: "English" },
  { id: 13, title: "Nutrition in Plants", subject: "Science", class: "Class 7", chapter: "Chapter 1", downloads: 589, rating: 4.8, size: "1.6 MB", language: "English" },
  { id: 14, title: "Nutrition in Animals", subject: "Science", class: "Class 7", chapter: "Chapter 2", downloads: 567, rating: 4.7, size: "1.5 MB", language: "English" },
  { id: 15, title: "Tracing Changes Through 1000 Years", subject: "Social Science", class: "Class 7", chapter: "History Ch-1", downloads: 512, rating: 4.7, size: "1.4 MB", language: "English" },
  { id: 16, title: "Three Questions", subject: "English", class: "Class 7", chapter: "Chapter 1", downloads: 534, rating: 4.7, size: "0.9 MB", language: "English" },
  
  // Class 8 Notes
  { id: 17, title: "Rational Numbers", subject: "Mathematics", class: "Class 8", chapter: "Chapter 1", downloads: 789, rating: 4.9, size: "1.6 MB", language: "English" },
  { id: 18, title: "Linear Equations in One Variable", subject: "Mathematics", class: "Class 8", chapter: "Chapter 2", downloads: 756, rating: 4.9, size: "1.5 MB", language: "English" },
  { id: 19, title: "Understanding Quadrilaterals", subject: "Mathematics", class: "Class 8", chapter: "Chapter 3", downloads: 723, rating: 4.8, size: "1.4 MB", language: "English" },
  { id: 20, title: "Crop Production and Management", subject: "Science", class: "Class 8", chapter: "Chapter 1", downloads: 678, rating: 4.8, size: "1.7 MB", language: "English" },
  { id: 21, title: "Microorganisms: Friend and Foe", subject: "Science", class: "Class 8", chapter: "Chapter 2", downloads: 656, rating: 4.8, size: "1.6 MB", language: "English" },
  { id: 22, title: "How, When and Where", subject: "Social Science", class: "Class 8", chapter: "History Ch-1", downloads: 589, rating: 4.7, size: "1.3 MB", language: "English" },
  { id: 23, title: "The Best Christmas Present", subject: "English", class: "Class 8", chapter: "Chapter 1", downloads: 623, rating: 4.8, size: "0.9 MB", language: "English" },
  
  // Class 9 Notes
  { id: 24, title: "Number Systems", subject: "Mathematics", class: "Class 9", chapter: "Chapter 1", downloads: 1234, rating: 4.9, size: "2.1 MB", language: "English" },
  { id: 25, title: "Polynomials", subject: "Mathematics", class: "Class 9", chapter: "Chapter 2", downloads: 1198, rating: 4.9, size: "1.9 MB", language: "English" },
  { id: 26, title: "Coordinate Geometry", subject: "Mathematics", class: "Class 9", chapter: "Chapter 3", downloads: 1156, rating: 4.8, size: "1.8 MB", language: "English" },
  { id: 27, title: "Linear Equations in Two Variables", subject: "Mathematics", class: "Class 9", chapter: "Chapter 4", downloads: 1123, rating: 4.8, size: "1.7 MB", language: "English" },
  { id: 28, title: "Matter in Our Surroundings", subject: "Science", class: "Class 9", chapter: "Chapter 1", downloads: 1089, rating: 4.9, size: "2.3 MB", language: "English" },
  { id: 29, title: "Is Matter Around Us Pure?", subject: "Science", class: "Class 9", chapter: "Chapter 2", downloads: 1056, rating: 4.8, size: "2.1 MB", language: "English" },
  { id: 30, title: "The Fundamental Unit of Life", subject: "Science", class: "Class 9", chapter: "Chapter 5", downloads: 1023, rating: 4.8, size: "2.0 MB", language: "English" },
  { id: 31, title: "The French Revolution", subject: "Social Science", class: "Class 9", chapter: "History Ch-1", downloads: 987, rating: 4.8, size: "2.4 MB", language: "English" },
  { id: 32, title: "India - Size and Location", subject: "Social Science", class: "Class 9", chapter: "Geography Ch-1", downloads: 923, rating: 4.7, size: "1.8 MB", language: "English" },
  { id: 33, title: "The Fun They Had", subject: "English", class: "Class 9", chapter: "Chapter 1", downloads: 876, rating: 4.7, size: "1.1 MB", language: "English" },
  
  // Class 10 Notes
  { id: 34, title: "Real Numbers", subject: "Mathematics", class: "Class 10", chapter: "Chapter 1", downloads: 2345, rating: 4.9, size: "2.5 MB", language: "English" },
  { id: 35, title: "Polynomials", subject: "Mathematics", class: "Class 10", chapter: "Chapter 2", downloads: 2234, rating: 4.9, size: "2.3 MB", language: "English" },
  { id: 36, title: "Pair of Linear Equations", subject: "Mathematics", class: "Class 10", chapter: "Chapter 3", downloads: 2198, rating: 4.9, size: "2.4 MB", language: "English" },
  { id: 37, title: "Quadratic Equations", subject: "Mathematics", class: "Class 10", chapter: "Chapter 4", downloads: 2156, rating: 4.9, size: "2.2 MB", language: "English" },
  { id: 38, title: "Introduction to Trigonometry", subject: "Mathematics", class: "Class 10", chapter: "Chapter 8", downloads: 2089, rating: 4.9, size: "2.6 MB", language: "English" },
  { id: 39, title: "Chemical Reactions and Equations", subject: "Science", class: "Class 10", chapter: "Chapter 1", downloads: 2567, rating: 4.9, size: "2.8 MB", language: "English" },
  { id: 40, title: "Acids, Bases and Salts", subject: "Science", class: "Class 10", chapter: "Chapter 2", downloads: 2456, rating: 4.9, size: "2.6 MB", language: "English" },
  { id: 41, title: "Life Processes", subject: "Science", class: "Class 10", chapter: "Chapter 6", downloads: 2345, rating: 4.9, size: "3.1 MB", language: "English" },
  { id: 42, title: "Light - Reflection and Refraction", subject: "Science", class: "Class 10", chapter: "Chapter 10", downloads: 2234, rating: 4.9, size: "2.9 MB", language: "English" },
  { id: 43, title: "Electricity", subject: "Science", class: "Class 10", chapter: "Chapter 12", downloads: 2123, rating: 4.9, size: "2.7 MB", language: "English" },
  { id: 44, title: "Rise of Nationalism in Europe", subject: "Social Science", class: "Class 10", chapter: "History Ch-1", downloads: 1876, rating: 4.8, size: "2.5 MB", language: "English" },
  { id: 45, title: "Resources and Development", subject: "Social Science", class: "Class 10", chapter: "Geography Ch-1", downloads: 1654, rating: 4.8, size: "2.2 MB", language: "English" },
  { id: 46, title: "Power Sharing", subject: "Social Science", class: "Class 10", chapter: "Civics Ch-1", downloads: 1567, rating: 4.7, size: "1.8 MB", language: "English" },
  { id: 47, title: "Development", subject: "Social Science", class: "Class 10", chapter: "Economics Ch-1", downloads: 1432, rating: 4.7, size: "1.9 MB", language: "English" },
  { id: 48, title: "A Letter to God", subject: "English", class: "Class 10", chapter: "Chapter 1", downloads: 1789, rating: 4.8, size: "1.2 MB", language: "English" },
  { id: 49, title: "Nelson Mandela: Long Walk to Freedom", subject: "English", class: "Class 10", chapter: "Chapter 2", downloads: 1678, rating: 4.8, size: "1.3 MB", language: "English" },
]

const subjects = ["All", "Mathematics", "Science", "Physics", "English", "Social Science"]
const classes = ["All", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]

const subjectIcons: Record<string, React.ReactNode> = {
  "Mathematics": <Calculator className="h-5 w-5 text-blue-600" />,
  "Science": <FlaskConical className="h-5 w-5 text-green-600" />,
  "Physics": <FlaskConical className="h-5 w-5 text-indigo-600" />,
  "Social Science": <Globe className="h-5 w-5 text-orange-600" />,
  "English": <BookMarked className="h-5 w-5 text-purple-600" />,
}

const subjectColors: Record<string, string> = {
  "Mathematics": "bg-blue-100 dark:bg-blue-900/30",
  "Science": "bg-green-100 dark:bg-green-900/30",
  "Physics": "bg-indigo-100 dark:bg-indigo-900/30",
  "Social Science": "bg-orange-100 dark:bg-orange-900/30",
  "English": "bg-purple-100 dark:bg-purple-900/30",
}

// NCERT Book codes mapping
const getBookCode = (classNum: string, subject: string): string => {
  const codes: Record<string, Record<string, string>> = {
    "6": { "Mathematics": "femh1", "Science": "fesc1", "Social Science": "fess1", "English": "fehl1" },
    "7": { "Mathematics": "gemh1", "Science": "gesc1", "Social Science": "gess1", "English": "gehc1" },
    "8": { "Mathematics": "hemh1", "Science": "hesc1", "Social Science": "hess1", "English": "hehd1" },
    "9": { "Mathematics": "iemh1", "Science": "iesc1", "Social Science": "iess1", "English": "iebe1" },
    "10": { "Mathematics": "jemh1", "Science": "jesc1", "Social Science": "jess1", "English": "jeff1" }
  }
  return codes[classNum]?.[subject] || "jemh1"
}

export default function ResourcesPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("All")
  const [selectedClass, setSelectedClass] = useState("All")
  const [selectedNote, setSelectedNote] = useState<typeof notes[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("videos")

  // Handle download click - show dialog with options
  const handleDownload = (note: typeof notes[0]) => {
    setSelectedNote(note)
    setDialogOpen(true)
  }

  // Handle video click
  const handleVideoClick = (video: typeof videos[0]) => {
    setSelectedVideo(video)
    setVideoDialogOpen(true)
  }

  // Open video in YouTube
  const openVideoExternal = () => {
    if (selectedVideo) {
      window.open(selectedVideo.videoUrl, '_blank')
      toast.success("Opening YouTube", {
        description: "Watch the full video lesson"
      })
    }
    setVideoDialogOpen(false)
  }

  // Get NCERT website URL for textbook
  const getNCERTUrl = (note: typeof notes[0]) => {
    const classNum = note.class.replace("Class ", "")
    const bookCode = getBookCode(classNum, note.subject)
    return `https://ncert.nic.in/textbook.php?${bookCode}=0-16`
  }

  // Open official NCERT website
  const openNCERT = () => {
    if (selectedNote) {
      window.open(getNCERTUrl(selectedNote), '_blank')
      toast.success("Opening NCERT Website", {
        description: "Select your chapter from the official NCERT page to download PDF"
      })
    }
    setDialogOpen(false)
  }

  // Open DIKSHA portal (government's digital education platform)
  const openDiksha = () => {
    window.open('https://diksha.gov.in/explore', '_blank')
    toast.success("Opening DIKSHA Portal", {
      description: "Search for your topic on India's digital education platform"
    })
    setDialogOpen(false)
  }

  // Open e-Pathshala (NCERT's mobile app website)
  const openEPathshala = () => {
    window.open('https://epathshala.nic.in/e-pathshala-4/flipbook/', '_blank')
    toast.success("Opening e-Pathshala", {
      description: "Browse NCERT books in flipbook format"
    })
    setDialogOpen(false)
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.chapter.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "All" || note.subject === selectedSubject
    const matchesClass = selectedClass === "All" || note.class === selectedClass
    return matchesSearch && matchesSubject && matchesClass
  })

  // Filter videos
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.chapter.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "All" || video.subject === selectedSubject
    const matchesClass = selectedClass === "All" || video.class === selectedClass
    return matchesSearch && matchesSubject && matchesClass
  })

  // Calculate stats
  const totalDownloads = notes.reduce((sum, note) => sum + note.downloads, 0)
  const totalViews = videos.reduce((sum, video) => sum + video.views, 0)
  const subjectCount = new Set(notes.map(n => n.subject)).size
  const classCount = new Set(notes.map(n => n.class)).size

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('resourcesPage.title')}</h1>
        <p className="text-muted-foreground">
          {t('resourcesPage.description')}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('resourcesPage.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('resourcesPage.allClasses')} />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('resourcesPage.allSubjects')} />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-3">
                <Youtube className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{videos.length}</p>
                <p className="text-sm text-muted-foreground">Video Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notes.length}</p>
                <p className="text-sm text-muted-foreground">Study Notes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(totalViews / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Video Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{classCount}</p>
                <p className="text-sm text-muted-foreground">Classes (6-10)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-100 dark:bg-orange-900/30 p-3">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{subjectCount}</p>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <Button
            key={subject}
            variant={selectedSubject === subject ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSubject(subject)}
            className={selectedSubject === subject ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            {subject}
          </Button>
        ))}
      </div>

      {/* Tabs for Videos and Notes */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="videos" className="gap-2">
            <Youtube className="h-4 w-4" />
            Video Lessons
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <FileText className="h-4 w-4" />
            Study Notes
          </TabsTrigger>
          <TabsTrigger value="accessible" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Student Access Links
          </TabsTrigger>
        </TabsList>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((video) => (
              <Card 
                key={video.id} 
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleVideoClick(video)}
              >
                <CardContent className="pt-6">
                  {/* Video Thumbnail */}
                  <div className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-lg h-32 flex items-center justify-center mb-4 group-hover:from-red-600 group-hover:to-red-800 transition-all">
                    <span className="text-4xl">{video.thumbnail}</span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="h-12 w-12 text-white" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white text-xs">
                      {video.duration}
                    </Badge>
                    <Badge className="absolute bottom-2 left-2 bg-black/70 text-white text-xs">
                      {video.class}
                    </Badge>
                  </div>
                  
                  {/* Video Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-muted-foreground">{video.subject} • {video.chapter}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {(video.views / 1000).toFixed(0)}K views
                      </span>
                      <Badge variant="outline" className="text-xs">{video.channel}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <Youtube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No videos found matching your filters</p>
              <p className="text-sm text-muted-foreground mt-2">Try changing the class or subject filter</p>
            </div>
          )}
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`rounded-lg p-2 ${subjectColors[note.subject] || 'bg-gray-100'}`}>
                      {subjectIcons[note.subject] || <FileText className="h-5 w-5 text-gray-600" />}
                    </div>
                    <Badge variant="outline" className="text-xs">{note.class}</Badge>
                  </div>
                  <CardTitle className="text-sm mt-3 line-clamp-2">{note.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {note.subject} • {note.chapter}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{note.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>{note.size}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{note.downloads}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{note.language}</Badge>
                    <Button 
                      size="sm" 
                      className="bg-orange-500 hover:bg-orange-600 text-xs"
                      onClick={() => handleDownload(note)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notes found matching your filters</p>
              <p className="text-sm text-muted-foreground mt-2">Try changing the class or subject filter</p>
            </div>
          )}
        </TabsContent>

        {/* Student Access Links Tab */}
        <TabsContent value="accessible" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Easily Accessible Learning Resources for Students</CardTitle>
              <CardDescription>
                Direct links to free educational content - NCERT textbooks, Khan Academy videos, and practice materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Study Materials */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">NCERT Mathematics Class 10</p>
                        <p className="text-xs text-muted-foreground">2.5 MB • PDF</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Complete NCERT textbook for Class 10 Mathematics</p>
                    <Button size="sm" variant="outline" asChild className="w-full">
                      <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Science Lab Manual</p>
                        <p className="text-xs text-muted-foreground">5.1 MB • PDF</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">NCERT Science practical experiments guide</p>
                    <Button size="sm" variant="outline" asChild className="w-full">
                      <a href="https://ncert.nic.in/" target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold">NCERT Social Studies</p>
                        <p className="text-xs text-muted-foreground">3.2 MB • PDF</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">History, Geography, Civics and Economics textbooks</p>
                    <Button size="sm" variant="outline" asChild className="w-full">
                      <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                {/* Video Lessons */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Khan Academy - English Grammar</p>
                        <p className="text-xs text-muted-foreground">45 min • Video</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Free video lessons on English grammar fundamentals</p>
                    <Button size="sm" asChild className="w-full">
                      <a href="https://www.khanacademy.org/humanities/grammar" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Khan Academy - Physics</p>
                        <p className="text-xs text-muted-foreground">30 min • Video</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Free physics video lessons and tutorials</p>
                    <Button size="sm" asChild className="w-full">
                      <a href="https://www.khanacademy.org/science/physics" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Biology Video Lessons</p>
                        <p className="text-xs text-muted-foreground">50 min • Video</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Cell biology, genetics, and human anatomy</p>
                    <Button size="sm" asChild className="w-full">
                      <a href="https://www.khanacademy.org/science/biology" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                {/* Practice Tests */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Mathematics Practice Questions</p>
                        <p className="text-xs text-muted-foreground">1.8 MB • PDF</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">NCERT Exemplar problems with solutions</p>
                    <Button size="sm" variant="outline" asChild className="w-full">
                      <a href="https://ncert.nic.in/exemplar-problems.php" target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">English Literature Notes</p>
                        <p className="text-xs text-muted-foreground">1.2 MB • PDF</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Chapter-wise summary and analysis</p>
                    <Button size="sm" variant="outline" asChild className="w-full">
                      <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Chemistry Tutorials</p>
                        <p className="text-xs text-muted-foreground">40 min • Video</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Chemical reactions, equations, and periodic table</p>
                    <Button size="sm" asChild className="w-full">
                      <a href="https://www.khanacademy.org/science/chemistry" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Mathematics Formula Sheet</p>
                        <p className="text-xs text-muted-foreground">0.8 MB • PDF</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">All important formulas for quick revision</p>
                    <Button size="sm" variant="outline" asChild className="w-full">
                      <a href="https://ncert.nic.in/" target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Geography Interactive Maps</p>
                        <p className="text-xs text-muted-foreground">35 min • Video</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">World geography with interactive content</p>
                    <Button size="sm" asChild className="w-full">
                      <a href="https://www.khanacademy.org/humanities/geography" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold">History Sample Papers</p>
                        <p className="text-xs text-muted-foreground">2.1 MB • PDF</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Previous year questions and sample papers</p>
                    <Button size="sm" variant="outline" asChild className="w-full">
                      <a href="https://cbseacademic.nic.in/" target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                  📚 These resources are also available in the Student Dashboard
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  All links open official educational websites (NCERT, Khan Academy, CBSE) in a new tab. Students can access these same resources from their learning resources page.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Download Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-orange-500" />
              Download Study Material
            </DialogTitle>
            <DialogDescription>
              {selectedNote && (
                <span className="block mt-2">
                  <strong>{selectedNote.title}</strong>
                  <br />
                  {selectedNote.subject} • {selectedNote.class} • {selectedNote.chapter}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground">
              Choose a source to download the PDF:
            </p>
            
            <Button 
              className="w-full justify-start gap-3 h-auto py-3" 
              variant="outline"
              onClick={openNCERT}
            >
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">NCERT Official Website</p>
                <p className="text-xs text-muted-foreground">Download chapter-wise PDFs directly</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
            
            <Button 
              className="w-full justify-start gap-3 h-auto py-3" 
              variant="outline"
              onClick={openDiksha}
            >
              <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
                <BookOpen className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">DIKSHA Portal</p>
                <p className="text-xs text-muted-foreground">Government&apos;s digital education platform</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
            
            <Button 
              className="w-full justify-start gap-3 h-auto py-3" 
              variant="outline"
              onClick={openEPathshala}
            >
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                <GraduationCap className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">e-Pathshala</p>
                <p className="text-xs text-muted-foreground">NCERT flipbook format for online reading</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            All materials are from official government sources
          </p>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              Watch Video Lesson
            </DialogTitle>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="space-y-4">
              {/* Video Preview */}
              <div className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-lg h-44 flex items-center justify-center">
                <span className="text-6xl">{selectedVideo.thumbnail}</span>
                <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                  {selectedVideo.duration}
                </Badge>
              </div>
              
              {/* Video Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedVideo.class}</Badge>
                  <Badge variant="outline">{selectedVideo.subject}</Badge>
                </div>
                <h3 className="font-semibold text-lg">{selectedVideo.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedVideo.chapter}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedVideo.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {(selectedVideo.views / 1000).toFixed(0)}K views
                  </span>
                  <span className="flex items-center gap-1">
                    <Youtube className="h-4 w-4" />
                    {selectedVideo.channel}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={openVideoExternal}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch on YouTube
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setVideoDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Video will open in YouTube for the best learning experience
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
