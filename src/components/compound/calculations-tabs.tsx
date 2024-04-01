import { useEffect, useMemo, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { MIN_BLOCK_HEIGHT } from '~/lib/constants'
import { showErrorToast } from '~/lib/show-error-toast'
import { CalculationType, type Period } from '~/types/calculations'
import { ExpressionActions } from '~/types/expressions'
import type { Task } from '~/types/task'

import { Icons } from '../icons'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { OneTimeCalculation } from './one-time-calculation'
import { PeriodicCalculation } from './periodic-calculation'

export interface CalculationsTabsProps {
  expressionId?: number
  save: () => Promise<number | undefined>
  isChanged?: () => boolean
  resetEdits?: () => void
  action: ExpressionActions
}

export const CalculationsTabs = ({ action, expressionId, save, isChanged, resetEdits }: CalculationsTabsProps) => {
  const navigate = useRouter()
  const pathname = usePathname()
  const axiosAuth = useAxiosAuth()

  const [tab, setTab] = useState<CalculationType>(CalculationType.ONE_TIME)
  const [periodical, setPeriodical] = useState('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [period, setPeriod] = useState<Period>({
    from: '',
    to: '',
  })

  useEffect(() => {
    setPeriod({
      from: '',
      to: '',
    })
    setPeriodical('')
    setOpenModal(false)
  }, [tab])

  const prove = async () => {
    let expression_id: number | undefined

    if (action === ExpressionActions.CREATE) {
      expression_id = await save()
    } else {
      expression_id = expressionId
    }

    if (!expression_id) return
    try {
      await axiosAuth.post<Task>(ApiRoutes.TASKS, {
        block_range: `${period.from}-${period.to}`,
        expression_id,
        ...(periodical && { periodical }),
      })
      navigate.push(`${pathname}/proofs`)
    } catch (error) {
      showErrorToast(error)
    }
  }

  const addressValidationErrors = useMemo(() => {
    if (!period.from || !period.to) return false
    return Number(period.from) > Number(period.to)
  }, [period])

  const minBlockHeightError = useMemo(() => {
    if (!period.from) return false
    return Number(period.from) < MIN_BLOCK_HEIGHT
  }, [period])

  return (
    <>
      <Tabs
        defaultValue={tab}
        onValueChange={(value) => {
          setTab(value as CalculationType)
        }}
        className='border-t-[1px] pt-5'
      >
        <TabsList className='mb-6 w-full'>
          <TabsTrigger value={CalculationType.ONE_TIME} className='w-full data-[state=active]:bg-transparent'>
            One time calculation
          </TabsTrigger>
          <TabsTrigger value={CalculationType.PERIODIC} className='w-full data-[state=active]:bg-transparent'>
            Periodic calculation
          </TabsTrigger>
        </TabsList>
        <TabsContent value={CalculationType.ONE_TIME} className='flex flex-col gap-10'>
          <OneTimeCalculation
            addressValidationErrors={addressValidationErrors}
            period={period}
            minBlockHeightError={minBlockHeightError}
            setPeriod={setPeriod}
            setOpenModal={setOpenModal}
            isChanged={isChanged}
            prove={prove}
          />
        </TabsContent>
        <TabsContent value={CalculationType.PERIODIC} className='flex flex-col gap-10'>
          <PeriodicCalculation
            periodical={periodical}
            addressValidationErrors={addressValidationErrors}
            period={period}
            minBlockHeightError={minBlockHeightError}
            setPeriodical={setPeriodical}
            setPeriod={setPeriod}
            setOpenModal={setOpenModal}
            isChanged={isChanged}
            prove={prove}
          />
        </TabsContent>
      </Tabs>
      <Dialog open={openModal}>
        <DialogContent>
          <DialogHeader className='flex flex-row items-center gap-2 border-b-0 pb-10'>
            <div>
              <Icons.warning />
            </div>
            <p className='text-base font-medium text-muted-foreground'>
              Are you sure you want to save and proof changed expression?
            </p>
          </DialogHeader>
          <div className='flex flex-col gap-4 lg:flex-row'>
            <Button
              className='w-full'
              variant='outline'
              onClick={() => {
                setOpenModal(false)
                resetEdits && resetEdits()
                void (async () => {
                  await prove()
                })()
              }}
            >
              No
            </Button>
            <Button
              className='w-full'
              onClick={() => {
                void (async () => {
                  await save()
                  await prove()
                })()
              }}
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
