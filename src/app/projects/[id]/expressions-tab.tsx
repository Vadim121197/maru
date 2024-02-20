'use client'

import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useProject } from '~/app/projects/[id]/ProjectProvider'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import { Expressions, expressionTypes } from '~/lib/expressions'
import type { Expression, ExpressionsResponse } from '~/types/expressions'
import { BaseExpressionForm } from '../../../components/base-expression-form'
import { EditBaseExpressionForm } from '../../../components/base-expression-form/edit-base-expression-form'
import { FinalExpressionForm } from '../../../components/final-expression-form'
import { EditFinalExpressionForm } from '../../../components/final-expression-form/edit-final-expression-form'
import { SelectComponent } from '../../../components/form-components'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion'
import { Button } from '../../../components/ui/button'

export const ExpressionsTab = () => {
  const { project, expressions, setExpressions } = useProject()((state) => state)
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth()

  const [loading, setLoading] = useState<boolean>(true)
  const [opened, setOpened] = useState('')
  const [openedFinal, setOpenedFinal] = useState('')
  const [addNew, setAddNew] = useState<boolean>(false)
  const [selectedSource, setSelectedSource] = useState<Expressions | undefined>()

  useEffect(() => {
    if (!project?.id) return

    void (async () => {
      try {
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

  if (loading && !expressions.base_expressions.length) return <></>

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

    setOpened('')
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

    setOpenedFinal('')
    setAddNew(false)
    setSelectedSource(undefined)
  }

  if (!project) return <></>

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-6'>
        <div className='flex w-full items-center justify-between lg:w-[50%]'>
          <p className='text-lg font-medium'>Expression</p>
          {expressions.base_expressions.length ? (
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
          ) : (
            <></>
          )}
        </div>
        {session?.user.id === project.user.id && !expressions.base_expressions.length && !addNew ? (
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
          <></>
        )}
        {addNew && (
          <div className='flex w-full flex-col gap-6 bg-card p-4 lg:w-[50%] lg:px-6 lg:pb-[50px] lg:pt-4'>
            <p className='text-center text-lg font-medium text-muted-foreground'>Editor</p>
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
        <Accordion
          type='single'
          value={opened}
          onValueChange={(value) => {
            setOpened(value)
            setAddNew(false)
          }}
          collapsible
          className='flex w-full flex-col gap-4 lg:w-[50%]'
        >
          {expressions.base_expressions.map((exp) => (
            <AccordionItem value={exp.id.toString()} key={exp.id}>
              <AccordionTrigger className='flex w-full flex-col gap-4 border-2 px-4 pb-[26px] pt-[18px] data-[state=open]:border-primary'>
                <div className='flex w-full flex-col gap-10'>
                  <p className='text-left text-base font-medium'>
                    {exp.name}=map({exp.raw_data}).filter(|result| ={'>'}
                    {exp.filter_data})
                  </p>
                  <div className='flex items-center gap-3'>
                    <p className='text-sm font-normal'>Aggregate</p>
                    <div className='border-2 px-8 py-[2px] text-sm font-normal'>{exp.aggregate_operation}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <EditBaseExpressionForm expression={exp} updateExpressionList={updateExpressionList} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      {expressions.final_expressions.length ? (
        <div className='flex flex-col gap-6'>
          <p className='text-lg font-medium'>Final Expressions Expression</p>
          <Accordion
            type='single'
            value={openedFinal}
            onValueChange={(value) => {
              setOpenedFinal(value)
              setAddNew(false)
            }}
            collapsible
            className='flex w-full flex-col gap-4 lg:w-[50%]'
          >
            {expressions.final_expressions.map((exp) => (
              <AccordionItem value={exp.id.toString()} key={exp.id}>
                <AccordionTrigger className='flex w-full flex-col gap-4 border-2 px-4 pb-[26px] pt-[18px] data-[state=open]:border-primary'>
                  <div className='flex w-full items-center justify-between'>
                    <p className='text-base font-medium'>{exp.name}</p>
                  </div>
                  <p className='text-sm font-normal text-muted-foreground'>{exp.raw_data}</p>
                </AccordionTrigger>
                <AccordionContent>
                  <EditFinalExpressionForm expression={exp} updateExpressionList={updateFinaleExpressionList} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
