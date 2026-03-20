import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border-2 border-black bg-white px-4 py-2 text-base font-bold shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all placeholder:text-gray-500 placeholder:font-medium focus-visible:outline-none focus-visible:translate-x-[4px] focus-visible:translate-y-[4px] focus-visible:shadow-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
