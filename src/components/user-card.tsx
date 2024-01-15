'use client'

import { useStore } from '~/state'
import { authSelector } from '~/state/auth'

export const UserCard = () => {
  const { user } = useStore(authSelector)
  return (
    <div className='flex items-center gap-3'>
      <div className='h-6 w-6 rounded-full bg-primary' />
      <p className='text-sm font-medium lg:text-base'>{user?.username}</p>
    </div>
  )
}
