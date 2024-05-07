'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'

export const UserCard = () => {
  const { data } = useSession()

  if (!data) return

  return (
    <div className='flex items-center gap-3'>
      {data.user.avatar_url ? (
        <Image src={data.user.avatar_url} width={24} height={24} className='rounded-full' alt='avatar' />
      ) : (
        <div className='size-6 rounded-full bg-primary' />
      )}
      <p className='break-all text-sm font-medium lg:text-base'>{data.user.username}</p>
    </div>
  )
}
