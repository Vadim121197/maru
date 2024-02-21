import { useMemo, type Dispatch, type SetStateAction, type RefObject, useState, useEffect } from 'react'
import { Info } from 'lucide-react'
import type { ExpressionValues, FinalExpressionTools } from '~/types/expressions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

interface ExpressionHelperTable {
  key: number
  constant: undefined
  proved: undefined
  function: undefined
  expression: string | undefined
}

export const FinalExpressionHelperTable = ({
  tools,
  textareaRef,
  setExpressionValues,
}: {
  tools: FinalExpressionTools
  textareaRef: RefObject<HTMLTextAreaElement>
  setExpressionValues: Dispatch<SetStateAction<ExpressionValues>>
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
    const maxLength = Math.max(tools.expressions.length)

    const arr: ExpressionHelperTable[] = []

    for (let i = 0; i < maxLength; i += 1) {
      const obj: ExpressionHelperTable = {
        key: i,
        constant: undefined,
        proved: undefined,
        function: undefined,
        expression: tools.expressions[i],
      }

      arr.push(obj)
    }

    return arr
  }, [tools])

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
        {tools.expressions.length ? (
          <div className='flex flex-col gap-4'>
            <div className='flex items-start gap-4'>
              <p className='text-[12px] font-normal leading-[18px]'>Expressions</p>
              <div>
                <Info className='h-4 w-4 text-primary' />
              </div>
            </div>
            <div className='grid grid-cols-3 gap-6'>
              {tools.expressions.map((i) => (
                <button
                  onClick={helperClick(i)}
                  type='button'
                  key={i}
                  className='text-left text-[12px] font-normal text-muted-foreground'
                >
                  {i}
                </button>
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
                <p className='text-sm font-normal'>Global Consts</p>
                <div>
                  <Info className='h-4 w-4 text-primary' />
                </div>
              </div>
            </TableHead>
            <TableHead className='text-center'>
              <div className='flex items-start justify-center gap-4'>
                <p className='text-sm font-normal'>Proved Values</p>
                <div>
                  <Info className='h-4 w-4 text-primary' />
                </div>
              </div>
            </TableHead>
            <TableHead className='text-center'>
              <div className='flex items-start justify-center gap-4'>
                <p className='text-sm font-normal'>Expressions</p>
                <div>
                  <Info className='h-4 w-4 text-primary' />
                </div>
              </div>
            </TableHead>
            <TableHead className='text-center'>
              <div className='flex items-start justify-center gap-4'>
                <p className='text-sm font-normal'>Global Functions</p>
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
                <button onClick={helperClick(i.constant)} type='button'>
                  {i.constant}
                </button>
              </TableCell>
              <TableCell className='text-center'>
                <button onClick={helperClick(i.proved)} type='button'>
                  {i.proved}
                </button>
              </TableCell>
              <TableCell className='text-center'>
                <button onClick={helperClick(i.expression)} type='button'>
                  {i.expression}
                </button>
              </TableCell>
              <TableCell className='text-center'>
                <button onClick={helperClick(i.function)} type='button'>
                  {i.function}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
