import { useMemo, type Dispatch, type SetStateAction } from 'react'
import type { ExpressionAggregateFunctions, ExpressionValues } from '~/types/expressions'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { SelectComponent } from './form-components'

interface ExpressionFieldProps {
  aggregateFunctions?: ExpressionAggregateFunctions[]
  expressionValues: ExpressionValues
  setExpressionValues: Dispatch<SetStateAction<ExpressionValues>>
}
export const ExpressionField = ({
  aggregateFunctions,
  expressionValues,
  setExpressionValues,
}: ExpressionFieldProps) => {
  const selectOptions = useMemo(() => {
    if (!aggregateFunctions?.length) return []
    return aggregateFunctions.map((aggr) => {
      return {
        value: aggr.name,
      }
    })
  }, [aggregateFunctions])

  return (
    <div className='flex w-full flex-col gap-2 border-2 border-border bg-background p-3 text-base font-medium lg:p-4'>
      <div className='flex flex-col justify-between gap-3 lg:flex-row lg:gap-5'>
        <Input
          className='h-7 w-full text-[12px] font-normal placeholder:text-[12px] lg:w-[200px] lg:text-sm'
          placeholder='Enter expression name'
          value={expressionValues.name}
          onChange={(e) => {
            setExpressionValues((state) => ({ ...state, name: e.target.value }))
          }}
        />
        {aggregateFunctions && aggregateFunctions.length ? (
          <div className='flex items-center gap-1 lg:gap-3'>
            <p className='text-[12px] font-normal lg:text-sm'>Aggregate</p>
            <SelectComponent
              defaultValue={expressionValues.aggregate}
              value={expressionValues.aggregate}
              onValueChange={(aggregate) => {
                setExpressionValues((state) => ({ ...state, aggregate }))
              }}
              options={selectOptions}
              triggerClassName='h-7 min-h-7 w-[105px] text-sm font-normal uppercase'
              selectItemClassName='uppercase'
              selectContentClassName='w-[105px] min-w-[105px]'
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <Textarea
        className='border-0 p-0 text-sm font-medium text-muted-foreground placeholder:text-[12px]  lg:text-base'
        placeholder='Enter expression'
        value={expressionValues.rawData}
        onChange={(e) => {
          setExpressionValues((state) => ({ ...state, rawData: e.target.value }))
        }}
      />
    </div>
  )
}