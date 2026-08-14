import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
        variant === "default" && "bg-blue-500 text-white shadow hover:bg-blue-600 active:scale-[0.98]",
        variant === "outline" && "border border-gray-200 bg-white shadow-sm hover:bg-gray-50 text-gray-700 active:scale-[0.98]",
        variant === "ghost" && "hover:bg-gray-100 hover:text-gray-900 text-gray-600",
        size === "default" && "h-11 px-4 py-2",
        size === "sm" && "h-9 rounded-lg px-3 text-xs",
        size === "lg" && "h-12 rounded-xl px-8",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
