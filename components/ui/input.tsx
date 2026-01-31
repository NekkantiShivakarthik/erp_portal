import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-800 dark:selection:text-blue-100 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 h-10 w-full min-w-0 rounded-xl border-2 bg-white/50 dark:bg-transparent px-4 py-2 text-base shadow-sm transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-blue-400 focus-visible:ring-blue-400/30 focus-visible:ring-[3px] focus-visible:bg-white dark:focus-visible:bg-slate-800/50",
        "hover:border-slate-300 dark:hover:border-slate-600",
        "aria-invalid:ring-red-400/20 dark:aria-invalid:ring-red-400/40 aria-invalid:border-red-400",
        className
      )}
      {...props}
    />
  )
}

export { Input }
