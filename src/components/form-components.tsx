import type { SelectProps } from '@radix-ui/react-select'
import { cn } from '~/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input, type InputProps } from './ui/input'

export const TextLabel = ({ label }: { label: string }) => <p className='text-base font-medium'>{label}</p>

export const SelectComponent = ({
  value,
  options,
  label,
  triggerClassName,
  onValueChange,
}: {
  value: SelectProps['value']
  options: { label?: string; value: string }[]
  label: string
  triggerClassName?: string
  onValueChange: SelectProps['onValueChange']
}) => {
  return (
    <div className='flex flex-col gap-[10px]'>
      <TextLabel label={label} />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn('w-full', triggerClassName)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem value={opt.value} key={opt.value}>
              {opt.label ?? opt.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const InputComponent = ({
  value,
  label,
  onChange,
}: {
  value: InputProps['value']
  label: string
  onChange: InputProps['onChange']
}) => {
  return (
    <div className='flex flex-col gap-[10px]'>
      <TextLabel label={label} />
      <Input value={value} onChange={onChange} />
    </div>
  )
}
