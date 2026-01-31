import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-blue-400/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm [a&]:hover:from-blue-600 [a&]:hover:to-indigo-700",
        secondary:
          "border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 text-slate-600 dark:text-slate-300 [a&]:hover:from-slate-100 [a&]:hover:to-slate-200",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-red-600 text-white [a&]:hover:from-red-600 [a&]:hover:to-red-700 focus-visible:ring-red-400/50 shadow-sm",
        outline:
          "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 [a&]:hover:bg-slate-50 dark:hover:bg-slate-800/50 [a&]:hover:text-slate-700",
        success:
          "border-transparent bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-sm",
        warning:
          "border-transparent bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
