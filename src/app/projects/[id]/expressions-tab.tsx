'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import type { AxiosError } from 'axios'
import { Bird, Plus, X } from 'lucide-react'

import { useProject } from '~/app/projects/[id]/ProjectProvider'
import { BaseExpressionForm } from '~/components/base-expression-form'
import { EditBaseExpressionForm } from '~/components/base-expression-form/edit-base-expression-form'
import { FinalExpressionForm } from '~/components/final-expression-form'
import { EditFinalExpressionForm } from '~/components/final-expression-form/edit-final-expression-form'
import { SelectComponent } from '~/components/form-components'
import { Accordion } from '~/components/ui/accordion'
import { Button } from '~/components/ui/button'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, EXPRESSION_ID, PROJECT_ID } from '~/lib/axios-instance'
import { Expressions, expressionTypes } from '~/lib/expressions'
import type { Expression, ExpressionsResponse } from '~/types/expressions'

export const ExpressionsTab = () => {
  const { project, expressions, isUserProject, setExpressions } = useProject()((state) => state)
  const axiosAuth = useAxiosAuth()

  const ref = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState<boolean | undefined>()
  const [selectedBaseExpression, setSelectedBaseExpression] = useState<string>('')
  const [selectedFinaleExpression, setSelectedFinaleExpression] = useState('')
  const [addNew, setAddNew] = useState<boolean>(false)
  const [selectedSource, setSelectedSource] = useState<Expressions | undefined>()

  useEffect(() => {
    if (!project?.id) return

    void (async () => {
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
    })()
  }, [project?.id, axiosAuth, setExpressions])

  const updateExpressionList = (expression: Expression, type: 'create' | 'update') => {
    // if other person's project do nothing
    if (!isUserProject) return

    let index: number
    if (type === 'update') {
      index = expressions.base_expressions.findIndex((exp) => exp.id === expression.id)
    } else {
      index = expressions.base_expressions.length
    }

    const newList = expressions.base_expressions

    newList[index] = expression

    setExpressions({
      final_expressions: expressions.final_expressions,
      base_expressions: newList,
    })

    setSelectedBaseExpression('')
    setAddNew(false)
    setSelectedSource(undefined)
  }

  const updateFinaleExpressionList = (expression: Expression, type: 'create' | 'update') => {
    // if other person's project do nothing
    if (!isUserProject) return

    let index: number
    if (type === 'update') {
      index = expressions.final_expressions.findIndex((exp) => exp.id === expression.id)
    } else {
      index = expressions.final_expressions.length
    }

    const newList = expressions.final_expressions

    newList[index] = expression

    setExpressions({
      base_expressions: expressions.base_expressions,
      final_expressions: newList,
    })

    setSelectedFinaleExpression('')
    setAddNew(false)
    setSelectedSource(undefined)
  }

  if (!project) return <></>

  const deleteExpression = async (id: number, type: 'base_expressions' | 'final_expressions') => {
    // if other person's project do nothing
    if (!isUserProject) return

    try {
      await axiosAuth.delete<Expression>(ApiRoutes.EXPRESSIONS_EXPRESSION_ID.replace(EXPRESSION_ID, id.toString()))

      const filteredExpression = expressions[type].filter((exp) => exp.id !== id)

      expressions[type] = filteredExpression

      setExpressions(expressions)
    } catch (error) {
      const err = error as AxiosError
      toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
    }
  }

  if (loading === undefined && !expressions.base_expressions.length) return <></>

  if (!loading && !expressions.base_expressions.length && !addNew)
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

  if (loading && !expressions.base_expressions.length) return <></>

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <p className='text-sm font-medium lg:text-lg'>Expression</p>
          {expressions.base_expressions.length && isUserProject ? (
            <Button
              variant='outline'
              className='flex w-[152px] items-center gap-[10px] lg:w-[274px]'
              onClick={() => {
                ref.current?.scrollIntoView({ behavior: 'smooth' })
                setAddNew(true)
                setSelectedBaseExpression('')
                setSelectedFinaleExpression('')
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
          value={selectedBaseExpression}
          onValueChange={(value) => {
            // if other person's project do nothing
            if (!isUserProject) return

            setSelectedBaseExpression(value)
            setSelectedFinaleExpression('')
            setAddNew(false)
          }}
          collapsible
          className='grid w-full grid-cols-1 gap-x-[22px] gap-y-4 lg:grid-cols-2'
        >
          {expressions.base_expressions.map((exp) => (
            <EditBaseExpressionForm
              expression={exp}
              updateExpressionList={updateExpressionList}
              key={exp.id}
              selectedExpression={selectedBaseExpression}
              deleteExpression={isUserProject ? deleteExpression : undefined}
              setSelectedExpression={setSelectedBaseExpression}
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
              <BaseExpressionForm updateExpressionList={updateExpressionList} />
            )}
            {selectedSource === Expressions.EXPRESSIONS && (
              <FinalExpressionForm updateExpressionList={updateFinaleExpressionList} />
            )}
          </div>
        )}
      </div>
      {expressions.final_expressions.length ? (
        <div className='mt-[60px] flex flex-col gap-4 lg:mt-10 lg:gap-6'>
          <p className='text-sm font-medium lg:text-lg'>Compound Expressions</p>
          <Accordion
            type='single'
            value={selectedFinaleExpression}
            onValueChange={(value) => {
              // if other person's project do nothing
              if (!isUserProject) return

              setSelectedFinaleExpression(value)
              setSelectedBaseExpression('')
              setAddNew(false)
            }}
            collapsible
            className='grid w-full grid-cols-1 gap-x-[22px] gap-y-4 lg:grid-cols-2'
          >
            {expressions.final_expressions.map((exp) => (
              <EditFinalExpressionForm
                expression={exp}
                updateExpressionList={updateFinaleExpressionList}
                key={exp.id}
                selectedExpression={selectedFinaleExpression}
                deleteExpression={isUserProject ? deleteExpression : undefined}
                setSelectedExpression={setSelectedFinaleExpression}
              />
            ))}
          </Accordion>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
