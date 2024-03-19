import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '~/auth'
import { BackButton } from '~/components/back-button'

import { UserInfoCard } from './user-info-card'
import UserProvider from './user-provider'
import { UsersTabs } from './user-tabs'

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  return (
    <UserProvider user={session.user}>
      <div className='container flex w-full flex-col gap-6 py-10 lg:w-[628px] lg:pt-[64px]'>
        <BackButton href='/' />
        <UserInfoCard />
        <UsersTabs />
        {children}
      </div>
    </UserProvider>
  )
}

export default RootLayout
