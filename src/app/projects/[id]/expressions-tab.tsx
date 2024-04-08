'use client'

import { useEffect, useRef, useState } from 'react'

import { Dialog } from '@radix-ui/react-dialog'
import { Bird, Plus, X } from 'lucide-react'

import { useProject } from '~/app/projects/[id]/ProjectProvider'
import { CreateCompound } from '~/components/compound/create-compound'
import { EditCompound } from '~/components/compound/edit-compound'
import { CreateEventData } from '~/components/event-data/create-event-data'
import { EditEventData } from '~/components/event-data/edit-event-data'
import { SelectComponent } from '~/components/form-components'
import { Icons } from '~/components/icons'
import { Accordion } from '~/components/ui/accordion'
import { Button } from '~/components/ui/button'
import { DialogContent, DialogHeader } from '~/components/ui/dialog'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, EXPRESSION_ID, PROJECT_ID } from '~/lib/axios-instance'
import { Expressions, expressionTypes } from '~/lib/expressions'
import { showErrorToast } from '~/lib/show-error-toast'
import {
  ExpressionActions,
  type Expression,
  ExpressionTypeResponse,
  type ExpressionsResponse,
} from '~/types/expressions'

export const ExpressionsTab = () => {
  const { project, expressions, isUserProject, setExpressions } = useProject()((state) => state)
  const axiosAuth = useAxiosAuth()

  const ref = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState<boolean | undefined>()
  const [selectedExpressionToDelete, setSelectedExpressionToDelete] = useState<{
    id: number
    type: ExpressionTypeResponse
  } | null>(null)
  const [selectedEventData, setSelectedEventData] = useState<string>('')
  const [selectedCompound, setSelectedCompound] = useState('')
  const [addNew, setAddNew] = useState<boolean>(false)
  const [selectedSource, setSelectedSource] = useState<Expressions | undefined>()

  const getExpressions = async () => {
    if (!project) return
    try {
      setLoading(true)
      const { data: projectExpressions } = await axiosAuth.get<ExpressionsResponse>(
        ApiRoutes.PROJECTS_PROJECT_ID_EXPRESSIONS.replace(PROJECT_ID, project.id.toString()),
      )

      setExpressions(projectExpressions)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!project?.id) return

    void (async () => {
      await getExpressions()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id])

  const updateExpressionList =
    (expressionType: ExpressionTypeResponse, action: ExpressionActions) => (expression: Expression) => {
      // if other person's project do nothing
      if (!isUserProject) return

      if (action === ExpressionActions.UPDATE) {
        void getExpressions()
      } else {
        const index = expressions[expressionType].length

        const newList = expressions[expressionType]

        newList[index] = expression

        setExpressions({
          ...expressions,
          [expressionType]: newList,
        })
      }
      setSelectedEventData('')
      setAddNew(false)
      setSelectedSource(undefined)
    }

  if (!project) return <></>

  const deleteExpression = (id: number, type: ExpressionTypeResponse) => {
    setSelectedExpressionToDelete({
      id,
      type,
    })
  }

  const approveDelete = async () => {
    // if other person's project do nothing
    if (!isUserProject || !selectedExpressionToDelete) return
    try {
      await axiosAuth.delete<Expression>(
        ApiRoutes.EXPRESSIONS_EXPRESSION_ID.replace(EXPRESSION_ID, selectedExpressionToDelete.id.toString()),
      )
      const filteredExpression = expressions[selectedExpressionToDelete.type].filter(
        (exp) => exp.id !== selectedExpressionToDelete.id,
      )
      expressions[selectedExpressionToDelete.type] = filteredExpression
      setExpressions(expressions)
      setSelectedExpressionToDelete(null)
    } catch (error) {
      showErrorToast(error)
    }
  }

  if ((loading === undefined || loading) && !expressions.event_data_expressions.length) return <></>

  if (!loading && !expressions.event_data_expressions.length && !addNew)
    return (
      <>
        {isUserProject ? (
          <div className='mt-[160px] flex flex-col items-center gap-2'>
            <p className='text-lg font-medium'>You don’t have any expression yet</p>
            <p className='mb-4 text-base font-medium'>Start creating expression by clicking on “ + Expression ”</p>
            <Button
              variant='outline'
              className='flex w-[274px] items-center gap-[10px]'
              onClick={() => {
                setAddNew(true)
              }}
            >
              <div>
                <Plus className='h-6 w-4' />
              </div>
              <p>Expression</p>
            </Button>
          </div>
        ) : (
          <section className='mt-[100px] flex flex-col items-center justify-center px-7 lg:container lg:mt-[150px]'>
            <Bird className='h-20 w-20' strokeWidth={1} />
            <p className='text-xl font-semibold'>No expressions</p>
          </section>
        )}
      </>
    )

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col gap-6'>
          <div className='flex w-full items-center justify-between'>
            <p className='text-sm font-medium lg:text-lg'>Expression</p>
            {expressions.event_data_expressions.length && isUserProject ? (
              <Button
                variant='outline'
                className='flex w-[152px] items-center gap-[10px] lg:w-[274px]'
                onClick={() => {
                  ref.current?.scrollIntoView({ behavior: 'smooth' })
                  setAddNew(true)
                  setSelectedEventData('')
                  setSelectedCompound('')
                }}
              >
                <div>
                  <Plus className='h-4 w-4' />
                </div>
                <p className='text-sm font-bold lg:text-base'>Expression</p>
              </Button>
            ) : (
              <></>
            )}
          </div>
          <Accordion
            type='single'
            value={selectedEventData}
            onValueChange={(value) => {
              // if other person's project do nothing
              if (!isUserProject) return

              setSelectedEventData(value)
              setSelectedCompound('')
              setAddNew(false)
            }}
            collapsible
            className='grid w-full grid-cols-1 gap-x-[22px] gap-y-4 lg:grid-cols-2'
          >
            {expressions.event_data_expressions.map((exp) => (
              <EditEventData
                expression={exp}
                updateExpressionList={updateExpressionList(ExpressionTypeResponse.EVENT_DATA, ExpressionActions.UPDATE)}
                key={exp.id}
                selectedExpression={selectedEventData}
                deleteExpression={isUserProject ? deleteExpression : undefined}
                setSelectedExpression={setSelectedEventData}
              />
            ))}
          </Accordion>
        </div>
        <div ref={ref} className={!addNew ? 'h-0' : ''}>
          {addNew && isUserProject && (
            <div className='mt-6 flex w-full flex-col bg-card px-4 pb-[60px] pt-4 lg:w-[calc(50%-11px)] lg:px-5'>
              <div className='mb-6 grid grid-cols-3'>
                <div />
                <p className='text-center text-xl font-medium text-muted-foreground lg:text-2xl lg:font-bold'>Editor</p>
                <div className='flex items-center justify-end'>
                  <X
                    strokeWidth={1}
                    className='h-5 w-5 cursor-pointer lg:h-6 lg:w-6'
                    onClick={() => {
                      setAddNew(false)
                    }}
                  />
                </div>
              </div>
              <SelectComponent
                value={selectedSource}
                onValueChange={(e) => {
                  setSelectedSource(e as Expressions)
                }}
                options={expressionTypes}
                label='Data source'
              />
              {selectedSource === Expressions.EVENT_DATA && (
                <CreateEventData
                  updateExpressionList={updateExpressionList(
                    ExpressionTypeResponse.EVENT_DATA,
                    ExpressionActions.CREATE,
                  )}
                />
              )}
              {selectedSource === Expressions.EXPRESSIONS && (
                <CreateCompound
                  updateExpressionList={updateExpressionList(ExpressionTypeResponse.COMPOUND, ExpressionActions.CREATE)}
                />
              )}
            </div>
          )}
        </div>
        {expressions.compound_expressions.length ? (
          <div className='mt-[60px] flex flex-col gap-4 lg:mt-10 lg:gap-6'>
            <p className='text-sm font-medium lg:text-lg'>Compound Expressions</p>
            <Accordion
              type='single'
              value={selectedCompound}
              onValueChange={(value) => {
                // if other person's project do nothing
                if (!isUserProject) return

                setSelectedCompound(value)
                setSelectedEventData('')
                setAddNew(false)
              }}
              collapsible
              className='grid w-full grid-cols-1 gap-x-[22px] gap-y-4 lg:grid-cols-2'
            >
              {expressions.compound_expressions.map((exp) => (
                <EditCompound
                  expression={exp}
                  updateExpressionList={updateExpressionList(ExpressionTypeResponse.COMPOUND, ExpressionActions.UPDATE)}
                  key={exp.id}
                  selectedExpression={selectedCompound}
                  deleteExpression={isUserProject ? deleteExpression : undefined}
                  setSelectedExpression={setSelectedCompound}
                />
              ))}
            </Accordion>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Dialog
        open={Boolean(selectedExpressionToDelete)}
        onOpenChange={(open) => {
          !open && setSelectedExpressionToDelete(null)
        }}
      >
        <DialogContent>
          <DialogHeader className='flex flex-row items-center gap-2 border-b-0 pb-10'>
            <div>
              <Icons.warning />
            </div>
            <p className='text-base font-medium text-muted-foreground'>Are you sure you want to delete expression?</p>
          </DialogHeader>
          <div className='flex flex-col gap-4 lg:flex-row'>
            <Button
              className='w-full'
              variant='outline'
              onClick={() => {
                setSelectedExpressionToDelete(null)
              }}
            >
              No
            </Button>
            <Button
              className='w-full'
              onClick={() => {
                void (async () => {
                  await approveDelete()
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
