'use client'

import { Switch } from '~/components/ui/switch'

import { DeleteAccount } from './delete-account'

const SettingsPage = () => {
  return (
    <div className='flex flex-col gap-6 bg-card p-6'>
      <h3 className='text-2xl font-bold leading-9'>Settings</h3>
      <div className='mb-4 flex items-center justify-between gap-2'>
        <p className='text-lg font-medium leading-[26px] opacity-45'>Theme preferences</p>
        <Switch checked={false} disabled />
      </div>
      <div className='mb-4 flex cursor-not-allowed items-center justify-between gap-2 opacity-45'>
        <p className='text-lg font-medium leading-[26px]'>Notifications email</p>
        <p className='text-base font-medium'>-</p>
      </div>
      <div className='flex flex-col items-center justify-between gap-2 lg:flex-row'>
        <div className='flex flex-col gap-2'>
          <p className='text-lg font-medium leading-[26px]'>Delete account</p>
          <p className='text-sm font-normal text-muted-foreground'>
            Once you delete your account , there is no going back. Please be certain
          </p>
        </div>
        <DeleteAccount />
      </div>
    </div>
  )
}

export default SettingsPage
