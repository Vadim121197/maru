'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const LoginPage = () => {
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) return

    void (async () => {
      await signIn('credentials', {
        code,
        redirect: true,
        callbackUrl: '/login',
      })
    })()
  }, [searchParams])

  return (
    <section className='mt-[100px] flex flex-col items-center justify-center px-7 lg:container lg:mt-[150px]'>
      <p className='mb-2 text-center text-xl font-medium lg:mb-4 lg:text-2xl lg:font-bold'>Sign in</p>
      <p className='mb-6 text-center text-base font-semibold text-muted-foreground lg:mb-[34px] lg:text-lg lg:font-medium'>
        We support Github OAuth
      </p>
    </section>
  )
}

export default LoginPage
