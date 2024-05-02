'use client'

import { useState, createContext, useContext } from 'react'

import { create } from 'zustand'

import type { Deployment } from '~/types/deployment'
import type { ExpressionsResponse } from '~/types/expressions'
import type { Project } from '~/types/project'
import type { Proof } from '~/types/proof'
import type { Task } from '~/types/task'

interface ProjectSlice {
  isUserProject: boolean
  project: Project | null
  proofs: Proof[]
  tasks: Task[]
  expressions: ExpressionsResponse
  deployments: Deployment[]
  summary: string
  setProjectOwnership: (isUserProject: boolean) => void
  setProject: (project: Project) => void
  setProofs: (proofs: Proof[]) => void
  setTask: (tasks: Task[]) => void
  setExpressions: (expression: ExpressionsResponse) => void
  setDeployments: (deployments: Deployment[]) => void
  setSummary: (summary: string) => void
}

const createStore = () => {
  return create<ProjectSlice>((set) => {
    return {
      isUserProject: false,
      project: null,
      proofs: [],
      tasks: [],
      expressions: {
        event_data_expressions: [],
        compound_expressions: [],
      },
      deployments: [],
      summary: '',
      setProjectOwnership(isUserProject) {
        set({
          isUserProject,
        })
      },
      setProject(project) {
        set({ project })
      },
      setProofs(proofs) {
        set({ proofs })
      },
      setTask(tasks) {
        set({ tasks })
      },
      setExpressions(expressions) {
        set({ expressions })
      },
      setDeployments(deployments) {
        set({ deployments })
      },
      setSummary(summary) {
        set({
          summary,
        })
      },
    }
  })
}

const ProjectContext = createContext<ReturnType<typeof createStore> | null>(null)

export const useProject = () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!ProjectContext) throw new Error('useProject must be used within a ProjectProvider')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(ProjectContext)!
}

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() => createStore())
  return <ProjectContext.Provider value={store}>{children}</ProjectContext.Provider>
}

export default ProjectProvider
