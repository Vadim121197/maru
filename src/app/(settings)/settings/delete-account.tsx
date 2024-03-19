'use client'

import { toast } from 'react-toastify'

import type { AxiosError } from 'axios'
import { signOut } from 'next-auth/react'

import { Button, buttonVariants } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '~/components/ui/dialog'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { cn } from '~/lib/utils'

export const DeleteAccount = () => {
  const axiosAuth = useAxiosAuth()

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          buttonVariants({
            variant: 'outline',
          }),
          'w-full lg:w-[196px]',
        )}
      >
        Delete account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='flex flex-row items-center gap-2 border-b-0 pb-10'>
          <div>
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <g id='bx:error'>
                <path
                  id='Vector'
                  d='M9.16783 8.33301H10.8345V12.4997H9.16783V8.33301ZM9.16699 13.333H10.8337V14.9997H9.16699V13.333Z'
                  fill='#FFDB00'
                />
                <path
                  id='Vector_2'
                  d='M11.4731 3.49999C11.1831 2.95416 10.6181 2.61499 9.99979 2.61499C9.38146 2.61499 8.81646 2.95416 8.52646 3.50082L2.41146 15.0533C2.27577 15.307 2.20855 15.5917 2.21644 15.8793C2.22433 16.1669 2.30706 16.4475 2.45646 16.6933C2.60371 16.9403 2.81283 17.1446 3.06317 17.2861C3.31351 17.4275 3.59642 17.5013 3.88396 17.5H16.1156C16.7056 17.5 17.2398 17.1983 17.544 16.6933C17.6931 16.4474 17.7757 16.1668 17.7836 15.8793C17.7915 15.5917 17.7244 15.3071 17.589 15.0533L11.4731 3.49999ZM3.88396 15.8333L9.99979 4.28082L16.1198 15.8333H3.88396Z'
                  fill='#FFDB00'
                />
              </g>
            </svg>
          </div>
          <p className='text-base font-medium text-muted-foreground'>Are you sure you want to delete account?</p>
        </DialogHeader>
        <div className='flex flex-col gap-4 lg:flex-row'>
          <DialogTrigger
            className={cn(
              buttonVariants({
                variant: 'outline',
              }),
              'w-full',
            )}
          >
            Cancel
          </DialogTrigger>

          <Button
            className='w-full'
            onClick={() => {
              void (async () => {
                try {
                  await axiosAuth.delete(ApiRoutes.USERS_ME)
                  await signOut()
                } catch (error) {
                  const err = error as AxiosError
                  toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
                }
              })()
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
