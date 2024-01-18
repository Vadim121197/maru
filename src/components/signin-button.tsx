import { cn } from '~/lib/utils'
import { usePathname } from 'next/navigation'
import { buttonVariants } from './ui/button'

export const SigninButton = ({ className }: { className?: string }) => {
  const pathname = usePathname()

  return (
    <a
      className={cn('w-[196px]', buttonVariants(), className)}
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_ID}&redirect_uri=${process.env.NEXT_PUBLIC_ORIGIN}${pathname}`}
    >
      Sign In
    </a>
  )
}
