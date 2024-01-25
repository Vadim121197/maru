import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { TextLabel } from './form-components'

export const OwnerInput = () => {
  const { data: session } = useSession()

  return (
    <div className='flex flex-col gap-[10px]'>
      <TextLabel label='Owner' />
      <div className='flex h-11 w-full items-center gap-3 border-2 border-border bg-background px-4 text-base font-medium text-muted'>
        {session?.user.avatar_url && (
          <div>
            <Image src={session.user.avatar_url} width={24} height={24} className='rounded-full' alt='avatar' />
          </div>
        )}
        <span>{session?.user.username ?? ''}</span>
      </div>
    </div>
  )
}
