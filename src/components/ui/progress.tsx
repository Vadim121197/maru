import * as React from 'react'

import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '~/lib/utils'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-[5px] w-full overflow-hidden rounded-full bg-[rgba(109,35,248,0.4)]', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        'h-full w-full flex-1 bg-primary transition-all',
        Number(value) >= 80 && Number(value) < 100 && 'bg-[#A48DFF]',
        Number(value) >= 100 && 'bg-[#A70000]',
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
