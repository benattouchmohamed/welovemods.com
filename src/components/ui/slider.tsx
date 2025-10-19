import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

// This is a placeholder component that doesn't render any UI
// We're keeping the component file but making it not display anything
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <div className="hidden">
    {/* Slider component is disabled */}
  </div>
))
Slider.displayName = "DisabledSlider"

export { Slider }
