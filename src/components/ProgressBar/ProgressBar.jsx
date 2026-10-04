import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "../../lib/utils"

export default function ProgressBar({ pct, className, indicatorClassName }) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-white/10",
        className
      )}
      value={pct}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-700 ease-out rounded-full",
          indicatorClassName || (
            pct >= 85
              ? "bg-gradient-to-r from-[#316b3f] to-[#62b57e]"
              : pct < 30
              ? "bg-gradient-to-r from-[#7d3730] to-[#d9695a]"
              : "bg-gradient-to-r from-[#c97f1f] to-[#eba43a]"
          )
        )}
        style={{ transform: `translateX(-${100 - (pct || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
