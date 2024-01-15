'use client'

import { useEffect } from 'react'
import { useStore } from '~/state'
import { SiteHeader } from '~/components/site-header'
import { TailwindIndicator } from '~/components/tailwind-indicator'
import { ThemeProvider } from '~/components/theme-provider'
import { fontSans } from '~/lib/fonts'
import { cn } from '~/lib/utils'
import '../styles/globals.css'

// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.name,
//     template: `%s - ${siteConfig.name}`,
//   },
//   icons: {
//     icon: '/favicon.svg',
//   },
// }

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  useEffect(() => {
    if (!localStorage.getItem('user_id')) return

    void (async () => {
      try {
        await useStore.getState().auth.getUserInfo()
      } catch {}
    })()
  }, [])
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased relative', fontSans.variable)}>
        <div className='absolute bottom-0 left-[-200px] hidden h-[576px] w-[600px] rounded-full bg-[rgba(32,27,47,0.75)] blur-[250px] lg:block' />
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
          <div className='relative flex min-h-screen flex-col'>
            <SiteHeader />
            <div className='flex-1'>{children}</div>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
