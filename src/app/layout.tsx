import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from '~/auth'
import { SessionProvider } from '~/components/providers/session-provider'
import { SignInProvider } from '~/components/providers/sign-in-provider'
import { SiteHeader } from '~/components/site-header'
import { TailwindIndicator } from '~/components/tailwind-indicator'
import { ThemeProvider } from '~/components/theme-provider'
import { siteConfig } from '~/config/site'
import { fontSans } from '~/lib/fonts'
import { cn } from '~/lib/utils'

import '../styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  icons: {
    icon: '/favicon.png',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const session = await getServerSession(authOptions)

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background relative', fontSans.variable)}>
        <div className='absolute bottom-0 left-[-200px] hidden h-[576px] w-[600px] rounded-full bg-[rgba(32,27,47,0.75)] blur-[250px] lg:block' />
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover={false}
          theme='dark'
        />
        <SessionProvider session={session}>
          <SignInProvider>
            <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
              <div className='relative flex min-h-screen flex-col'>
                <SiteHeader />
                <div className='flex-1'>{children}</div>
              </div>
              <TailwindIndicator />
            </ThemeProvider>
          </SignInProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

export default RootLayout
