'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { InputComponent, SelectComponent } from './form-components'
import { OwnerInput } from './owner-input'
import { Button } from './ui/button'

export const ImportProjectForm = () => {
  const { data: session } = useSession()

  const [name, setName] = useState('')

  return (
    <form className='flex w-full flex-col gap-6 bg-card p-4 lg:p-6'>
      <SelectComponent label='Project' value={undefined} options={[]} />
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <OwnerInput />
        <InputComponent
          value={name}
          label='Project name'
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </div>
      <Button type='submit' className='mt-[34px] w-[196px] self-center' disabled={!session}>
        Create
      </Button>
    </form>
  )
}
