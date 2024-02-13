import { cn } from '~/lib/utils'
import { Input, type InputProps } from './ui/input'
import { TextLabel } from './form-components'

export interface Validation {
  checkFn: (txt: string) => boolean
  type: 'warn' | 'error' // corresponds to red or yellow
  issue: string
}

export const validationResult = (value: string, validations?: Validation[]): undefined | Validation => {
  if (!validations) return
  const results = validations.filter((v) => v.checkFn(value))
  const error = results.find((v) => v.type === 'error')
  return error ? error : results.find((v) => v.type === 'warn')
}

interface InputBlockProps extends InputProps {
  label?: string
  className?: string
  inputClassName?: string
  validations?: Validation[]
  value: string
}

export const InputBlock = ({
  label,
  placeholder,
  className,
  inputClassName,
  validations,
  value,
  ...props
}: InputBlockProps) => {
  const vResult = validationResult(value, validations)

  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        vResult?.type === 'error' && 'border-red-400',
        vResult?.type === 'warn' && 'border-yellow-300',
        className,
      )}
    >
      {label && (
        <div className='flex items-center gap-2 self-start'>
          <TextLabel label={label} />
          {vResult ? <div className={cn('italic', 'text-red-400')}>{vResult.issue}</div> : null}
        </div>
      )}
      <Input
        className={cn(
          vResult?.type === 'error' && 'border-red-400',
          vResult?.type === 'warn' && 'border-yellow-300',
          inputClassName,
        )}
        placeholder={placeholder}
        value={value}
        {...props}
      />
      {!label && (
        <div className='flex items-center gap-2 self-start'>
          {vResult ? <div className={cn('italic', 'text-red-400')}>{vResult.issue}</div> : null}
        </div>
      )}
    </div>
  )
}
