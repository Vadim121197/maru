'use client'

import { useState } from 'react'

import { InputComponent, TextLabel } from '~/components/form-components'
import { Button } from '~/components/ui/button'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { showErrorToast } from '~/lib/show-error-toast'
import type { User } from '~/types/auth'

import { useUser } from '../user-provider'

const ProfilePage = () => {
  const axiosAuth = useAxiosAuth()
  const { user, setUser } = useUser()((state) => state)

  const [bio, setBio] = useState<string | null>(user?.bio ?? null)
  return (
    <form
      className='flex flex-col gap-[14px] bg-card p-6'
      onSubmit={(e) => {
        e.preventDefault()

        void (async () => {
          try {
            const { data: user } = await axiosAuth.put<User>(ApiRoutes.USERS_ME, {
              bio,
            })

            setUser(user)
          } catch (error) {
            showErrorToast(error)
          }
        })()
      }}
    >
      <h3 className='mb-[10px] text-2xl font-bold leading-9'>Profile details</h3>
      <div className='flex flex-col gap-2'>
        <TextLabel label='Name' />
        <div className='h-11 border-2 bg-background px-4 py-[10px] text-base font-medium'>{user?.username}</div>
      </div>
      <InputComponent
        label='Bio'
        value={bio ?? ''}
        onChange={(e) => {
          setBio(e.target.value)
        }}
        placeholder='Enter bio'
      />
      <div className='flex flex-col gap-2'>
        <TextLabel label='Email' />
        <div className='h-11 border-2 bg-background px-4 py-[10px] text-base font-medium'>{}</div>
      </div>
      <Button className='mt-[26px] w-full lg:w-[274px] lg:self-center' disabled={user?.bio === bio}>
        Save
      </Button>
    </form>
  )
}

export default ProfilePage
