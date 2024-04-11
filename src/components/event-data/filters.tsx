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
      ...filters,
      label: i.name,
      value: i.name,
    }))
  }, [filters])

  const addFilter = () => {
    const lastInvisibleIndex = filters.findIndex((i) => !i.vissible)

    if (lastInvisibleIndex === -1) return

    const filter = filters[lastInvisibleIndex]
    if (!filter) return

    filter.vissible = true
    const newArray = filters.filter((i) => i.name !== filter.name)
    newArray.push(filter)

    setFilters(newArray)
  }

  const selectFilter = (value: string, index: number) => {
    const nextValueIndex = filters.filter((i) => i.vissible).findIndex((i) => i.name === value)

    const newArray = [...filters]

    const oldFilter = newArray[index]

    if (!oldFilter) return

    if (nextValueIndex === -1) {
      const newFilterIndex = newArray.findIndex((i) => i.name === value)
      const newFilter = newArray[newFilterIndex]
      if (!newFilter) return

      newFilter.vissible = true
      oldFilter.vissible = false

      setFilters(newArray)
    } else {
      const nextValueIndex = filters.findIndex((i) => i.name === value)
      const newFilter = newArray[nextValueIndex]
      if (!newFilter) return
      newArray[index] = newFilter
      newArray[nextValueIndex] = oldFilter
      setFilters(newArray)
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      {filters.map((i, index) => {
        if (!i.vissible) return
        return (
          <div className='flex gap-2' key={i.name}>
            <SelectComponent
              value={i.name}
              options={options}
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
            <Button variant='secondary' onClick={addFilter} className='font-medium'>
              +
            </Button>
          </div>
        )
      })}
    </div>
  )
}
