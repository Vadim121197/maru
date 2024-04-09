import Link from 'next/link'

import { siteConfig } from '~/config/site'

import { Icons } from './icons'

export const Logo = () => (
  <div className='flex gap-4 lg:gap-6'>
    <Link href='/' className='flex items-center gap-4 lg:gap-6'>
      <Icons.logo className='h-[30px] w-[30px] lg:h-[46px] lg:w-[49px]' />
      <span className='inline-block text-sm font-normal text-muted-foreground lg:text-2xl lg:font-medium'>
        {siteConfig.name}
      </span>
    </Link>
  </div>
)
