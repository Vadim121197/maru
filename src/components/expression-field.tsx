import { type Dispatch, type SetStateAction } from 'react'
import type { ExpressionAggregateFunctions, ExpressionValues } from '~/types/expressions'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'

interface ExpressionFieldProps {
  aggregateFunctions: ExpressionAggregateFunctions[]
  expressionValues: ExpressionValues
  setExpressionValues: Dispatch<SetStateAction<ExpressionValues>>
}
export const ExpressionField = ({
  aggregateFunctions,
  expressionValues,
  setExpressionValues,
}: ExpressionFieldProps) => {
  return (
    <div className='flex w-full flex-col gap-2 border-2 border-border bg-background p-4 text-base font-medium'>
      <div className='flex justify-between'>
        <Input
          className='h-7 w-[200px] text-sm font-normal placeholder:text-[12px]'
          placeholder='Enter expression name'
          value={expressionValues.name}
          onChange={(e) => {
            setExpressionValues((state) => ({ ...state, name: e.target.value }))
          }}
        />
        {aggregateFunctions.length ? (
          <div className='flex items-center gap-3'>
            <p className='text-sm font-normal'>Aggregate</p>
            <Select
              defaultValue={expressionValues.aggregate}
              onValueChange={(aggregate) => {
                setExpressionValues((state) => ({ ...state, aggregate }))
              }}
            >
              <SelectTrigger className='h-7 min-h-7 w-[105px] text-sm font-normal uppercase'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aggregateFunctions.map((agr) => (
                  <SelectItem value={agr.name} key={agr.name} className='uppercase'>
                    {agr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Textarea
        className='border-0 p-0 text-base font-medium text-muted-foreground  placeholder:text-[12px]'
        placeholder='Enter expression'
        value={expressionValues.rawData}
        onChange={(e) => {
          setExpressionValues((state) => ({ ...state, rawData: e.target.value }))
        }}
      />
    </div>
  )
}
