import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-300 dark:bg-gray-700", // base and dark mode background color
        className // additional custom className passed as a prop
      )}
      {...props}
    />
  )
}

export { Skeleton }
