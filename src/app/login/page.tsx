'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { useStore } from '~/state'
import { authSelector } from '~/state/auth'

const LoginPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useStore(authSelector)

  useEffect(() => {
    if (searchParams.get('installation_id') && searchParams.get('setup_action')) {
      router.push('/')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const signIn = () => {
    const code = searchParams.get('code')

    if (!code) return

    void (async () => {
      try {
        await login(code)
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
