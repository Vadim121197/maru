import { getServerSession } from 'next-auth'
import Image from 'next/image'

import { authOptions } from '~/auth'

export const UserCard = async () => {
  const session = await getServerSession(authOptions)

  if (!session) return

  return (
    <div className='flex items-center gap-3'>
      {session.user.avatar_url ? (
        <Image src={session.user.avatar_url} width={24} height={24} className='rounded-full' alt='avatar' />
      ) : (
        <div className='h-6 w-6 rounded-full bg-primary' />
      )}
      <p className='break-all text-sm font-medium lg:text-base'>{session.user.username}</p>
    </div>
  )
}
