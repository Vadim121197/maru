import { useMemo, type Dispatch, type SetStateAction } from 'react'
import type {
  BaseExpressionValues,
  ExpressionConstants,
  ExpressionEvent,
  ExpressionEventParam,
  ExpressionFunction,
  ExpressionTools,
} from '~/types/expressions'
import { Info } from 'lucide-react'
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
  setExpressionValues: Dispatch<SetStateAction<BaseExpressionValues>>
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
    <>
      <div className='flex flex-col gap-6 lg:hidden'>
        {tools.constants.length ? (
          <div className='flex flex-col gap-2'>
            <p className='text-[12px] font-normal'>Contract Consts</p>
            <div className='grid grid-cols-2 gap-4'>
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
        {tools.functions.length ? (
          <div className='flex flex-col gap-2'>
            <p className='text-[12px] font-normal'>Contract Functions</p>
            <div className='grid grid-cols-2 gap-4'>
              {tools.functions.map((i) => (
                <div className='flex flex-col items-start gap-1' key={i.name}>
                  <p className='text-[10px] font-semibold leading-3 text-primary'>{i.arg_type}</p>
                  <button
                    onClick={helperClick(i.name)}
                    type='button'
                    className='break-all text-left text-[12px] font-normal text-muted-foreground'
                    disabled={!i.is_active}
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
          <div className='flex flex-col gap-2'>
            <p className='text-[12px] font-normal'>Event Params</p>
            <div className='grid grid-cols-2 gap-4'>
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
          <TableRow>
            <TableHead className='flex items-start gap-4'>
              <p>Contract Consts</p>
              <div>
                <Info className='h-4 w-4 text-primary' />
              </div>
            </TableHead>
            <TableHead className='text-center'>Contract Functions</TableHead>
            <TableHead className='text-center'>Event Params</TableHead>
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
                <p className='pb-1 text-[10px] font-semibold leading-3 text-primary'>{i.function?.arg_type}</p>
                <button disabled={!i.function?.is_active} onClick={helperClick(i.function?.name)} type='button'>
                  {i.function?.name}
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
