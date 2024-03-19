import * as React from 'react'

import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '~/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-[16px] border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-[#2A263A]',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
      )}
    >
      <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <g id='moon'>
          <path
            id='Combined Shape'
            fillRule='evenodd'
            clipRule='evenodd'
            d='M13.7175 8.76822C13.1785 8.95141 12.6009 9.05077 12 9.05077C9.05449 9.05077 6.66668 6.66296 6.66668 3.71744C6.66668 3.11657 6.76604 2.53892 6.94924 2C4.84633 2.71485 3.33334 4.70612 3.33334 7.05077C3.33334 9.99629 5.72116 12.3841 8.66668 12.3841C11.0113 12.3841 13.0026 10.8711 13.7175 8.76822Z'
            fill='#2A263A'
          />
        </g>
      </svg>
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
