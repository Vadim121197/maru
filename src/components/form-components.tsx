import type { SelectProps } from '@radix-ui/react-select'

import { cn } from '~/lib/utils'

import { Input, type InputProps } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export const TextLabel = ({ label }: { label: string }) => <p className='text-sm font-medium lg:text-base'>{label}</p>

export const SelectComponent = ({
  options,
  label,
  triggerClassName,
  selectItemClassName,
  selectContentClassName,
  ...props
}: {
  options: { label?: string; value: string }[]
  label?: string
  triggerClassName?: string
  selectItemClassName?: string
  selectContentClassName?: string
} & SelectProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {label && <TextLabel label={label} />}
      <Select {...props}>
        <SelectTrigger className={cn('w-full', triggerClassName)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={selectContentClassName}>
          {options.map((opt) => (
            <SelectItem value={opt.value} key={opt.value} className={selectItemClassName}>
              {opt.label ?? opt.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const InputComponent = ({ label, className, ...props }: { label: string; className?: string } & InputProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <TextLabel label={label} />
      <Input {...props} />
    </div>
  )
}
