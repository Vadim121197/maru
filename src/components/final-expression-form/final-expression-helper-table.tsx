import { useMemo, type Dispatch, type SetStateAction } from 'react'
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
  setExpressionValues,
}: {
  tools: FinalExpressionTools
  setExpressionValues: Dispatch<SetStateAction<ExpressionValues>>
}) => {
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
    if (!value) return
    setExpressionValues((state) => ({ ...state, rawData: `${state.rawData} ${value}` }))
  }
  return (
    <>
      <div className='flex flex-col gap-6 lg:hidden'>
        {tools.expressions.length ? (
          <div className='flex flex-col gap-2'>
            <p className='text-[12px] font-normal'>Expressions</p>
            <div className='grid grid-cols-2 gap-4'>
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
          <TableRow>
            <TableHead>Global Consts</TableHead>
            <TableHead className='text-center'>Proved Values</TableHead>
            <TableHead className='text-center'>Expressions</TableHead>
            <TableHead className='text-center'>Global Functions</TableHead>
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
