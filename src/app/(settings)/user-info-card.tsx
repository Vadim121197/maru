'use client'

import Image from 'next/image'

import { useUser } from './user-provider'

export const UserInfoCard = () => {
  const { user } = useUser()((state) => state)
  return (
    <div className='flex items-center justify-center gap-4'>
      {user?.avatar_url && <Image src={user.avatar_url} width={40} height={40} className='rounded-full' alt='avatar' />}
      <p className='text-2xl font-bold leading-9'>{user?.username}</p>
    </div>
  )
}
