'use client'

import { UserRound } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

import { siteConfig } from '~/config/site'

import { SigninButton } from './signin-button'
import { Button } from './ui/button'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'

export const UserButton = () => {
  const { data: session } = useSession()

  return (
    <>
      <SigninButton variant='outline' className={!session ? 'hidden lg:inline-flex' : 'hidden'} />
      <Sheet>
        <SheetTrigger>
          <div className={!session ? 'hidden' : 'hidden lg:block'}>
            <UserRound strokeWidth='1' className='ml-3 h-8 w-8' />
          </div>
          <div className='block lg:hidden'>
            <svg xmlns='http://www.w3.org/2000/svg' width='29' height='18' viewBox='0 0 29 18' fill='none'>
              <path d='M29 0H0V2H29V0Z' fill='#CEC5C5' />
              <path d='M28.9996 16.0001H16.1663V18.0001H28.9996V16.0001Z' fill='#CEC5C5' />
              <path d='M29 7.99994H8V9.99994H29V7.99994Z' fill='#CEC5C5' />
            </svg>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className='mb-6'>
            <SheetTitle className='text-left text-base font-medium'>{session?.user.username}</SheetTitle>
          </SheetHeader>
          <div className='flex flex-col'>
            <div className='mb-6'>
              {!session ? (
                <SigninButton className='w-full' />
              ) : (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                <Button className='w-full' onClick={signOut}>
                  Sign out
                </Button>
              )}
            </div>
            <nav className='mb-6 flex flex-col gap-4 border-b-[1px] border-border pb-6'>
              {siteConfig.mainNav.map(
                (item) =>
                  item.href && (
                    <SheetClose asChild key={item.href}>
                      <Link href={item.href} className='flex items-center gap-2 text-[12px] font-normal leading-[18px]'>
                        <div>{item.icon}</div>
                        <span>{item.title}</span>
                      </Link>
                    </SheetClose>
                  ),
              )}
            </nav>
            <nav className='mb-[18px] flex flex-col gap-4 border-b-[1px] border-border pb-6'>
              {siteConfig.secondaryNav.map(
                (item) =>
                  item.href && (
                    <SheetClose asChild key={item.href}>
                      <Link href={item.href} className='flex items-center gap-2 text-[12px] font-normal leading-[18px]'>
                        <div>{item.icon}</div>
                        <span>{item.title}</span>
                      </Link>
                    </SheetClose>
                  ),
              )}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
