'use client'

import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useProject } from '~/app/projects/[id]/ProjectProvider'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, EXPRESSION_ID, PROJECT_ID } from '~/lib/axios-instance'
import { Expressions, expressionTypes } from '~/lib/expressions'
import type { Expression, ExpressionsResponse } from '~/types/expressions'
import { BaseExpressionForm } from '../../../components/base-expression-form'
import { EditBaseExpressionForm } from '../../../components/base-expression-form/edit-base-expression-form'
import { FinalExpressionForm } from '../../../components/final-expression-form'
import { EditFinalExpressionForm } from '../../../components/final-expression-form/edit-final-expression-form'
import { SelectComponent } from '../../../components/form-components'
import { Accordion } from '../../../components/ui/accordion'
import { Button } from '../../../components/ui/button'

export const ExpressionsTab = () => {
  const { project, expressions, setExpressions } = useProject()((state) => state)
  const { data: session } = useSession()
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

  if (!loading && !expressions.base_expressions.length && session?.user.id === project.user.id && !addNew)
    return (
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
    )

  if (loading && !expressions.base_expressions.length) return <></>

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <p className='text-sm lg:text-lg font-medium'>Expression</p>
          {expressions.base_expressions.length ? (
            <Button
              variant='outline'
              className='flex w-[152px] lg:w-[274px] items-center gap-[10px]'
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
              deleteExpression={deleteExpression}
            />
          ))}
        </Accordion>
      </div>
      <div ref={ref} className={!addNew ? 'h-0' : ''}>
        {addNew && (
          <div className='flex w-full flex-col bg-card mt-6 lg:w-[calc(50%-11px)] pt-4 px-4 lg:px-5 pb-[60px]'>
            <p className='text-center text-xl font-medium text-muted-foreground lg:text-2xl lg:font-bold mb-6'>Editor</p>
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
        <div className='flex flex-col gap-4 lg:gap-6 mt-[60px] lg:mt-10'>
          <p className='text-sm lg:text-lg font-medium'>Final Expressions</p>
          <Accordion
            type='single'
            value={selectedFinaleExpression}
            onValueChange={(value) => {
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
                deleteExpression={deleteExpression}
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