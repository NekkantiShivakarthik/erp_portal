import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-pink-400/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm [a&]:hover:from-pink-600 [a&]:hover:to-purple-600",
        secondary:
          "border-pink-200 dark:border-pink-800/50 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-600 dark:text-pink-300 [a&]:hover:from-pink-100 [a&]:hover:to-purple-100",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-rose-500 text-white [a&]:hover:from-red-600 [a&]:hover:to-rose-600 focus-visible:ring-red-400/50 shadow-sm",
        outline:
          "border-pink-200 dark:border-pink-800/50 text-pink-600 dark:text-pink-300 [a&]:hover:bg-pink-50 dark:hover:bg-pink-900/20 [a&]:hover:text-pink-700",
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
