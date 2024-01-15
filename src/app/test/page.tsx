'use client'

import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { useStore } from '~/state'
import { authSelector } from '~/state/auth'

const LoginPage = ({ searchParams }: { searchParams: { code: string } }) => {
  const router = useRouter()
  const { login } = useStore(authSelector)

  const signIn = () => {
    if (!searchParams.code) return

    void (async () => {
      try {
        await login(searchParams.code)
        router.push('/')
      } catch (error) {}
    })()
  }
  return (
    <section className='mt-[100px] flex flex-col items-center justify-center px-7 lg:container lg:mt-[150px]'>
      <p className='mb-2 text-center text-xl font-medium lg:mb-4 lg:text-2xl lg:font-bold'>Sign in</p>
      <p className='mb-6 text-center text-base font-semibold text-muted-foreground lg:mb-[34px] lg:text-lg lg:font-medium'>
        We support Github OAuth
      </p>
      <Button className={cn('w-[196px]')} onClick={signIn}>
        Sign In
      </Button>
    </section>
  )
}

export default LoginPage
