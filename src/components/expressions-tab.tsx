import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import { Expressions, expressionTypes } from '~/lib/expressions'
import type { Expression, ExpressionsResponse } from '~/types/expressions'
import type { Project } from '~/types/project'
import { BaseExpressionForm } from './base-expression-form'
import { EditBaseExpressionForm } from './base-expression-form/edit-base-expression-form'
import { FinalExpressionForm } from './final-expression-form'
import { EditFinalExpressionForm } from './final-expression-form/edit-final-expression-form'
import { SelectComponent } from './form-components'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Button } from './ui/button'

export const ExpressionsTab = ({
  project,
  updateProject,
}: {
  project: Project
  updateProject: (newProject: Project) => void
}) => {
  const axiosAuth = useAxiosAuth()

  const [loading, setLoading] = useState<boolean>(true)
  const [opened, setOpened] = useState('')
  const [openedFinal, setOpenedFinal] = useState('')
  const [addNew, setAddNew] = useState<boolean>(false)
  const [selectedSource, setSelectedSource] = useState<Expressions | undefined>()
  const [projectExpressions, setProjectExpressions] = useState<ExpressionsResponse>({
    base_expressions: [],
    final_expressions: [],
  })

  useEffect(() => {
    void (async () => {
      try {
        const { data: projectExpressions } = await axiosAuth.get<ExpressionsResponse>(
          ApiRoutes.PROJECTS_PROJECT_ID_EXPRESSIONS.replace(PROJECT_ID, project.id.toString()),
        )

        setProjectExpressions(projectExpressions)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    })()
  }, [project.id, axiosAuth])

  if (loading) return <></>

  const updateExpressionList = (expression: Expression, type: 'create' | 'update') => {
    let index: number
    if (type === 'update') {
      index = projectExpressions.base_expressions.findIndex((exp) => exp.id === expression.id)
    } else {
      index = projectExpressions.base_expressions.length
    }

    const newList = projectExpressions.base_expressions

    newList[index] = expression

    setProjectExpressions((state) => ({
      final_expressions: state.final_expressions,
      base_expressions: newList,
    }))
    setOpened('')
    setAddNew(false)
    setSelectedSource(undefined)
  }

  const updateFinaleExpressionList = (expression: Expression, type: 'create' | 'update') => {
    let index: number
    if (type === 'update') {
      index = projectExpressions.final_expressions.findIndex((exp) => exp.id === expression.id)
    } else {
      index = projectExpressions.final_expressions.length
    }

    const newList = projectExpressions.final_expressions

    newList[index] = expression

    setProjectExpressions((state) => ({
      base_expressions: state.base_expressions,
      final_expressions: newList,
    }))
    setOpenedFinal('')
    setAddNew(false)
    setSelectedSource(undefined)
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-6'>
        <div className='flex w-full items-center justify-between lg:w-[50%]'>
          <p className='text-lg font-medium'>Expression</p>
          {projectExpressions.base_expressions.length ? (
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
        {!projectExpressions.base_expressions.length && !addNew ? (
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
          <div className='flex w-full flex-col gap-6 bg-card p-4 lg:w-[50%] lg:p-6'>
            <SelectComponent
              value={selectedSource}
              onValueChange={(e) => {
                setSelectedSource(e as Expressions)
              }}
              options={expressionTypes}
              label='Data source'
            />
            {selectedSource === Expressions.EVENT_DATA && (
              <BaseExpressionForm
                project={project}
                updateExpressionList={updateExpressionList}
                updateProject={updateProject}
              />
            )}
            {selectedSource === Expressions.EXPRESSIONS && (
              <FinalExpressionForm
                project={project}
                updateExpressionList={updateFinaleExpressionList}
                updateProject={updateProject}
              />
            )}
          </div>
        )}
        <Accordion
          type='single'
          value={opened}
          onValueChange={(value) => {
            setOpened(value)
          }}
          collapsible
          className='flex w-full flex-col gap-4 lg:w-[50%]'
        >
          {projectExpressions.base_expressions.map((exp) => (
            <AccordionItem value={exp.id.toString()} key={exp.id}>
              <AccordionTrigger className='flex w-full flex-col gap-4 border-2 px-4 pb-[26px] pt-[18px] data-[state=open]:border-primary'>
                <div className='flex w-full items-center justify-between'>
                  <p className='text-base font-medium'>{exp.name}</p>
                  <div className='flex items-center gap-3'>
                    <p className='text-sm font-normal'>Aggregate</p>
                    <div className='border-2 px-8 py-[2px] text-sm font-normal'>{exp.aggregate_operation}</div>
                  </div>
                </div>
                <p className='text-sm font-normal text-muted-foreground'>{exp.raw_data}</p>
              </AccordionTrigger>
              <AccordionContent>
                <EditBaseExpressionForm
                  expression={exp}
                  project={project}
                  updateExpressionList={updateExpressionList}
                  updateProject={updateProject}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      {projectExpressions.final_expressions.length ? (
        <div className='flex flex-col gap-6'>
          <p className='text-lg font-medium'>Final Expressions Expression</p>
          <Accordion
            type='single'
            value={openedFinal}
            onValueChange={(value) => {
              setOpenedFinal(value)
            }}
            collapsible
            className='flex w-full flex-col gap-4 lg:w-[50%]'
          >
            {projectExpressions.final_expressions.map((exp) => (
              <AccordionItem value={exp.id.toString()} key={exp.id}>
                <AccordionTrigger className='flex w-full flex-col gap-4 border-2 px-4 pb-[26px] pt-[18px] data-[state=open]:border-primary'>
                  <div className='flex w-full items-center justify-between'>
                    <p className='text-base font-medium'>{exp.name}</p>
                  </div>
                  <p className='text-sm font-normal text-muted-foreground'>{exp.raw_data}</p>
                </AccordionTrigger>
                <AccordionContent>
                  <EditFinalExpressionForm
                    expression={exp}
                    project={project}
                    updateProject={updateProject}
                    updateExpressionList={updateFinaleExpressionList}
                  />
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
