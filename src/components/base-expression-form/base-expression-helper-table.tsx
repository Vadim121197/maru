import { useMemo, type Dispatch, type SetStateAction, type RefObject, useState, useEffect } from 'react'

import { Info } from 'lucide-react'

import type {
  BaseExpressionValues,
  ChainlinkPrice,
  ExpressionConstants,
  ExpressionEvent,
  ExpressionEventParam,
  ExpressionTools,
} from '~/types/expressions'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

export interface ExpressionHelperTable {
  key: number
  constant: ExpressionConstants | undefined
  chainlinkPrice: ChainlinkPrice | undefined
  param: ExpressionEventParam | undefined
  // global_constants: ExpressionConstants | undefined
}

export const BaseExpressionHelperTable = ({
  textareaRef,
  tools,
  event,
  setExpressionValues,
}: {
  tools: ExpressionTools
  event: ExpressionEvent
  textareaRef: RefObject<HTMLTextAreaElement>
  setExpressionValues: Dispatch<SetStateAction<BaseExpressionValues>>
}) => {
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>()

  // The basic problem as I see it is that .setSelectionRange() is being used in-line in the template, and should be wrapped in a useEffect().
  //https://stackoverflow.com/questions/60129605/is-javascripts-setselectionrange-incompatible-with-react-hooks
  useEffect(() => {
    if (!selection || !textareaRef.current) return
    const { start, end } = selection
    textareaRef.current.focus()
    textareaRef.current.setSelectionRange(start, end)
  }, [selection, textareaRef])

  const data = useMemo(() => {
    const maxLength = Math.max(
      tools.constants.length,
      tools.chainlink_prices.length,
      // tools.global_constants.length,
      event.params.length,
    )

    const arr: ExpressionHelperTable[] = []

    for (let i = 0; i < maxLength; i += 1) {
      const obj: ExpressionHelperTable = {
        key: i,
        constant: tools.constants[i],
        chainlinkPrice: tools.chainlink_prices[i],
        param: event.params[i],
        // global_constants: tools.global_constants[i],
      }

      arr.push(obj)
    }

    return arr
  }, [tools, event])

  const helperClick = (value: string | undefined) => () => {
    if (!textareaRef.current || !value) return

    const startPosition = textareaRef.current.selectionStart
    const endPosition = textareaRef.current.selectionEnd

    const value1 = textareaRef.current.value

    setExpressionValues((state) => ({
      ...state,
      rawData: `${value1.substring(0, startPosition)}${value}${value1.substring(endPosition, value1.length)}`,
    }))

    setSelection({ start: startPosition + value.length, end: startPosition + value.length })
  }
  return (
    <>
      <div className='flex flex-col gap-10 lg:hidden'>
        {tools.constants.length ? (
          <div className='flex flex-col gap-4'>
            <div className='flex items-start gap-4'>
              <p className='text-[12px] font-normal leading-[18px]'>Contract Consts</p>
              <div>
                <Info className='h-4 w-4 text-primary' />
              </div>
            </div>
            <div className='grid grid-cols-3 gap-6'>
              {tools.constants.map((i) => (
                <div className='flex flex-col items-start gap-1' key={i.name}>
                  <p className='text-[10px] font-semibold leading-3 text-primary'>{i.arg_type}</p>
                  <button
                    onClick={helperClick(i.name)}
                    type='button'
                    className='text-left text-[12px] font-normal text-muted-foreground'
                  >
                    {i.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
        {tools.chainlink_prices.length ? (
          <div className='flex flex-col gap-4'>
            <div className='flex items-start gap-4'>
              <p className='text-[12px] font-normal leading-[18px]'>ChainLink Prices</p>
              <div>
                <Info className='h-4 w-4 text-primary' />
              </div>
            </div>
            <div className='grid grid-cols-3 gap-6'>
              {tools.chainlink_prices.map((i) => (
                <div className='flex flex-col items-start gap-1' key={i.name}>
                  <p className='text-[10px] font-semibold leading-3 text-primary'>{i.arg_type}</p>
                  <button
                    onClick={helperClick(i.name)}
                    type='button'
                    className='break-all text-left text-[12px] font-normal text-muted-foreground'
                  >
                    {i.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
        {event.params.length ? (
          <div className='flex flex-col gap-4'>
            <div className='flex items-start gap-4'>
              <p className='text-[12px] font-normal leading-[18px]'>Event Params</p>
              <div>
                <Info className='h-4 w-4 text-primary' />
              </div>
            </div>
            <div className='grid grid-cols-3 gap-6'>
              {event.params.map((i) => (
                <div className='flex flex-col items-start gap-1' key={i.name}>
                  <p className='text-[10px] font-semibold leading-3 text-primary'>{i.arg_type}</p>
                  <button
                    onClick={helperClick(i.name)}
                    type='button'
                    className='text-left text-[12px] font-normal text-muted-foreground'
                    disabled={i.is_indexed}
                  >
                    {i.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Table className='hidden lg:table'>
        <TableHeader>
          <TableRow className='h-6'>
            <TableHead>
              <div className='flex items-start gap-4'>
                <p className='text-sm font-normal'>Contract Consts</p>
                <div>
                  <Info className='h-4 w-4 text-primary' />
                </div>
              </div>
            </TableHead>
            <TableHead className='text-center'>
              <div className='flex items-start justify-center gap-4'>
                <p className='text-sm font-normal'>ChainLink Prices</p>
                <div>
                  <Info className='h-4 w-4 text-primary' />
                </div>
              </div>
            </TableHead>
            <TableHead className='text-center'>
              <div className='flex items-start justify-center gap-4'>
                <p className='text-sm font-normal'>Event Params</p>
                <div>
                  <Info className='h-4 w-4 text-primary' />
                </div>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((i) => (
            <TableRow key={i.key}>
              <TableCell>
                <p className='pb-1 text-[10px] font-semibold leading-3 text-primary'>{i.constant?.arg_type}</p>
                <button onClick={helperClick(i.constant?.name)} type='button'>
                  {i.constant?.name}
                </button>
              </TableCell>
              <TableCell className='text-center'>
                <p className='pb-1 text-[10px] font-semibold leading-3 text-primary'>{i.chainlinkPrice?.arg_type}</p>
                <button onClick={helperClick(i.chainlinkPrice?.name)} type='button'>
                  {i.chainlinkPrice?.name}
                </button>
              </TableCell>
              <TableCell className='text-center'>
                <p className='pb-1 text-[10px] font-semibold leading-3 text-primary'>{i.param?.arg_type}</p>
                <button disabled={i.param?.is_indexed} onClick={helperClick(i.param?.name)} type='button'>
                  {i.param?.name}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
