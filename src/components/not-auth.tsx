import { SigninButton } from './signin-button'
import { Icons } from './icons'

export const NotAuth = () => {
  return (
    <section className='mt-[100px] flex flex-col items-center justify-center px-7 lg:container lg:mt-[150px]'>
      <p className='mb-2 text-center text-xl font-medium lg:mb-4 lg:text-2xl lg:font-bold'>Sign in</p>
      <p className='mb-6 text-center text-base font-semibold text-muted-foreground lg:mb-[34px] lg:text-lg lg:font-medium'>
        We support Github OAuth
      </p>
      <div className='flex w-full items-center justify-center bg-card px-4 py-[62px] lg:w-[628px]'>
        <SigninButton className='w-full lg:w-[330px]'>
          <div className='flex items-center gap-[10px]'>
            <div>
              <Icons.gitHub width={16} height={16} />
            </div>
            <p className='text-sm font-bold lg:text-base lg:font-semibold'>Continue with GitHub</p>
          </div>
        </SigninButton>
      </div>
    </section>
  )
}
