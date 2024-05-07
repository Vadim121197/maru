import { useMemo, type Dispatch, type SetStateAction } from 'react'

import type { ExpressionEventParam } from '~/types/expressions'

import { SelectComponent } from '../form-components'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export type Filter = Omit<ExpressionEventParam, 'value'> & {
  value: number
  vissible: boolean
  enteredValue: string
}

interface FiltersProps {
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
}

export const Filters = ({ filters, setFilters }: FiltersProps) => {
  const options = useMemo(() => {
    return filters.map((i) => ({
      ...i,
      label: i.name,
      value: i.name,
    }))
  }, [filters])

  const addFilter = () => {
    const firstInvisibleIndex = filters.findIndex((i) => !i.vissible)

    if (firstInvisibleIndex === -1) return

    const filter = filters[firstInvisibleIndex]

    if (!filter) return

    filter.vissible = true
    const newArray = [...filters]

    newArray[firstInvisibleIndex] = filter

    setFilters(newArray)
  }

  const selectFilter = (value: string, index: number) => {
    const newArray = [...filters]

    const oldFilter = newArray[index]

    if (!oldFilter) return

    const newFilterIndex = newArray.findIndex((i) => i.name === value)
    const newFilter = newArray[newFilterIndex]
    if (!newFilter) return

    newFilter.vissible = true
    oldFilter.vissible = false

    newArray[index] = newFilter
    newArray[newFilterIndex] = oldFilter

    setFilters(newArray)
  }

  return (
    <div className='flex flex-col gap-2'>
      {filters.map((i, index, arr) => {
        if (!i.vissible) return

        const lastVissibleIndex = arr.findLastIndex((el) => el.vissible)
        const currentFilter = options.filter((f) => i.name === f.name)
        const invisibleFilters = options.filter((f) => f.name !== i.name && !f.vissible)

        return (
          <div className='flex gap-2' key={i.name}>
            <SelectComponent
              value={i.name}
              options={[...currentFilter, ...invisibleFilters]}
              onValueChange={(value) => {
                selectFilter(value, index)
              }}
            />
            <Input
              value={i.enteredValue}
              onChange={(e) => {
                const newArray = [...filters]
                const filter = newArray[index]
                if (!filter) return

                filter.enteredValue = e.target.value

                setFilters(newArray)
              }}
            />
            {lastVissibleIndex === index && arr.length - 1 !== index && (
              <Button variant='secondary' onClick={addFilter} className='font-medium'>
                +
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}
