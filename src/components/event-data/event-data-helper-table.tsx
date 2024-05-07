import { useEffect, useState, type Dispatch, type RefObject, type SetStateAction, useMemo } from 'react'

import { Info } from 'lucide-react'

import type { BaseExpressionValues, ExpressionEvent, ExpressionTools } from '~/types/expressions'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

export const EventDataHelperTable = ({
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

  const filteredParams = useMemo(() => {
    return event.params.filter((i) => !i.is_indexed)
  }, [event.params])

  return (
    <>
      <div className='flex flex-col gap-10 lg:hidden'>
        {tools.constants.length ? (
          <div className='flex flex-col gap-4'>
            <div className='flex items-start gap-4'>
              <p className='text-[12px] font-normal leading-[18px]'>Contract Consts</p>
              <div>
                <Info className='size-4 text-primary' />
              </div>
            </div>
            <Select
              defaultValue={tools.constants[0]?.name}
              onValueChange={(value) => {
                helperClick(value)()
              }}
            >
              <SelectTrigger className='w-fit gap-2 border-0 bg-transparent '>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tools.constants.map((opt) => (
                  <SelectItem value={opt.name} key={opt.name}>
                    <p className='text-[10px] font-semibold leading-3 text-primary'>{opt.arg_type}</p>
                    <p className='text-left text-[12px] font-normal text-muted-foreground'>{opt.name}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <></>
        )}
        {tools.chainlink_prices.length ? (
          <div className='flex flex-col gap-4'>
            <div className='flex items-start gap-4'>
              <p className='text-[12px] font-normal leading-[18px]'>ChainLink Prices</p>
              <div>
                <Info className='size-4 text-primary' />
              </div>
            </div>
            <Select
              defaultValue={tools.chainlink_prices[0]?.name}
              onValueChange={(value) => {
                helperClick(value)()
              }}
            >
              <SelectTrigger className='w-fit gap-2 border-0 bg-transparent '>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tools.chainlink_prices.map((opt) => (
                  <SelectItem value={opt.name} key={opt.name}>
                    <p className='text-[10px] font-semibold leading-3 text-primary'>{opt.arg_type}</p>
                    <p className='text-left text-[12px] font-normal text-muted-foreground'>{opt.name}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <></>
        )}
        {filteredParams.length ? (
          <div className='flex flex-col gap-4'>
            <div className='flex items-start gap-4'>
              <p className='text-[12px] font-normal leading-[18px]'>Event Params</p>
              <div>
                <Info className='size-4 text-primary' />
              </div>
            </div>
            <div className='grid grid-cols-3 gap-6'>
              {filteredParams.map((i) => (
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
                  <Info className='size-4 text-primary' />
                </div>
              </div>
            </TableHead>
            <TableHead className='text-center'>
              <div className='flex items-start justify-center gap-4'>
                <p className='text-sm font-normal'>ChainLink Prices</p>
                <div>
                  <Info className='size-4 text-primary' />
                </div>
              </div>
            </TableHead>
            <TableHead className='text-center'>
              <div className='flex items-start justify-center gap-4'>
                <p className='text-sm font-normal'>Event Params</p>
                <div>
                  <Info className='size-4 text-primary' />
                </div>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              {tools.constants.length ? (
                <Select
                  defaultValue={tools.constants[0]?.name}
                  onValueChange={(value) => {
                    helperClick(value)()
                  }}
                >
                  <SelectTrigger className='w-fit gap-2 border-0 bg-transparent '>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tools.constants.map((opt) => (
                      <SelectItem value={opt.name} key={opt.name}>
                        <p className='pb-1 text-[10px] font-semibold leading-3 text-primary'>{opt.arg_type}</p>
                        <p className='break-all text-left text-[12px] font-normal text-muted-foreground'>{opt.name}</p>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <></>
              )}
            </TableCell>
            <TableCell>
              {tools.chainlink_prices.length ? (
                <Select
                  defaultValue={tools.chainlink_prices[0]?.name}
                  onValueChange={(value) => {
                    helperClick(value)()
                  }}
                >
                  <SelectTrigger className='w-fit gap-2 border-0 bg-transparent'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tools.chainlink_prices.map((opt) => (
                      <SelectItem value={opt.name} key={opt.name}>
                        <p className='pb-1 text-[10px] font-semibold leading-3 text-primary'>{opt.arg_type}</p>
                        <p className='break-all text-left text-[12px] font-normal text-muted-foreground'>{opt.name}</p>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <></>
              )}
            </TableCell>
            <TableCell className='text-center'>
              <p className='pb-1 text-[10px] font-semibold leading-3 text-primary'>{filteredParams[0]?.arg_type}</p>
              <button
                disabled={filteredParams[0]?.is_indexed}
                onClick={helperClick(filteredParams[0]?.name)}
                type='button'
              >
                {filteredParams[0]?.name}
              </button>
            </TableCell>
          </TableRow>
          {filteredParams
            .filter((_, index) => index !== 0)
            .map((i) => (
              <TableRow key={i.name}>
                <TableCell />
                <TableCell />
                <TableCell className='text-center'>
                  <p className='pb-1 text-[10px] font-semibold leading-3 text-primary'>{i.arg_type}</p>
                  <button disabled={i.is_indexed} onClick={helperClick(i.name)} type='button'>
                    {i.name}
                  </button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  )
}
