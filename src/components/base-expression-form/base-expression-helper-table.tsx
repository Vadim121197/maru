import { useMemo, type Dispatch, type SetStateAction } from 'react'
import type {
  ExpressionConstants,
  ExpressionEvent,
  ExpressionEventParam,
  ExpressionFunction,
  ExpressionTools,
  ExpressionValues,
} from '~/types/expressions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

export interface ExpressionHelperTable {
  key: number
  constant: ExpressionConstants | undefined
  function: ExpressionFunction | undefined
  param: ExpressionEventParam | undefined
  // global_constants: ExpressionConstants | undefined
}

export const BaseExpressionHelperTable = ({
  tools,
  event,
  setExpressionValues,
}: {
  tools: ExpressionTools
  event: ExpressionEvent
  setExpressionValues: Dispatch<SetStateAction<ExpressionValues>>
}) => {
  const data = useMemo(() => {
    const maxLength = Math.max(
      tools.constants.length,
      tools.functions.length,
      // tools.global_constants.length,
      event.params.length,
    )

    const arr: ExpressionHelperTable[] = []

    for (let i = 0; i < maxLength; i += 1) {
      const obj: ExpressionHelperTable = {
        key: i,
        constant: tools.constants[i],
        function: tools.functions[i],
        param: event.params[i],
        // global_constants: tools.global_constants[i],
      }

      arr.push(obj)
    }

    return arr
  }, [tools, event])

  const helperClick = (value: string | undefined) => () => {
    if (!value) return
    setExpressionValues((state) => ({ ...state, rawData: `${state.rawData} ${value}` }))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Global Consts</TableHead>
          <TableHead className='text-center'>Contract Consts</TableHead>
          <TableHead className='text-center'>Contract Functions</TableHead>
          <TableHead className='text-center'>Event Params</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((i) => (
          <TableRow key={i.key}>
            {/* <TableCell>
              <button onClick={helperClick(i.global_constants?.name)} type='button'>
                {i.global_constants?.name}
              </button>
            </TableCell> */}
            <TableCell className='text-center'>
              <button onClick={helperClick(i.constant?.name)} type='button'>
                {i.constant?.name}
              </button>
            </TableCell>
            <TableCell className='text-center'>
              <button onClick={helperClick(i.function?.name)} type='button'>
                {i.function?.name}
              </button>
            </TableCell>
            <TableCell className='text-center'>
              <button onClick={helperClick(i.param?.name)} type='button'>
                {i.param?.name}
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
