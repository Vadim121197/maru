import Link from 'next/link'
import { siteConfig } from '~/config/site'
import { MainNav } from './main-nav'

import { UserButton } from './user-button'

export const SiteHeader = () => (
  <header className='sticky top-0 z-40 w-full bg-background'>
    <div className='bg-header'>
      <div className='flex h-[72px] items-center space-x-4 pl-[14px] pr-5 lg:container sm:justify-between sm:space-x-0 lg:h-[86px]'>
        <MainNav />
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <div className='flex items-center gap-6'>
            {/* <ThemeToggle /> */}
            <nav className='hidden gap-6 lg:flex'>
              {siteConfig.mainNav.map(
                (item) =>
                  item.href && (
                    <Link key={item.href} href={item.href} className='flex text-base font-semibold'>
                      {item.title}
                    </Link>
                  ),
              )}
            </nav>
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  </header>
)
