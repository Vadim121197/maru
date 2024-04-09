import { Logo } from './logo'
import { MainNav } from './main-nav'
import { UserButton } from './user-button'

export const SiteHeader = () => {
  return (
    <header className='sticky top-0 z-40 w-full bg-background'>
      <div className='bg-header'>
        <div className='flex h-[72px] items-center space-x-4 pl-[14px] pr-5 lg:container sm:justify-between sm:space-x-0 lg:h-[86px]'>
          <Logo />
          <div className='flex flex-1 items-center justify-end space-x-4'>
            <div className='flex items-center gap-6'>
              <MainNav />
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
