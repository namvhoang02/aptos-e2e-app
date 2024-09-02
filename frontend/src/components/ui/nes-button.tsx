import { Slot } from "@radix-ui/react-slot"
import { type VariantProps,cva } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "whitespace-nowrap transition-colors",
    "font-medium text-sm",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "rounded-none",
    "nes-btn", // NES style
  ],
  {
    variants: {
      colors: {
        default: "shadow-[0_0_0_6px_rgba(173,175,188,0.3)]",
        primary: "is-primary shadow-[0_0_0_6px_rgba(0,107,179,0.3)]",
        success: "is-success shadow-[0_0_0_6px_rgba(74,165,46,0.3)]",
        warning: "is-warning shadow-[0_0_0_6px_rgba(229,148,0,0.3)]",
        error: "is-error shadow-[0_0_0_6px_rgba(140,32,34,0.3)]",
        disabled: "is-disabled",
      },
      variant: {
        // default: "bg-primary text-primary-foreground hover:bg-primary/90",
        default: "",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-0 border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      colors: "default",
      variant: "default",
      size: "default",
    },
  }
)

export interface NesButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const NesButton = React.forwardRef<HTMLButtonElement, NesButtonProps>(
  ({ className, colors, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ colors, variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
NesButton.displayName = "NesButton"

export { buttonVariants,NesButton }
