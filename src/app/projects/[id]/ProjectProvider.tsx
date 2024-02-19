'use client'

import { useState, createContext, useContext } from 'react'
import { create } from 'zustand'
import type { ExpressionsResponse } from '~/types/expressions'
import type { Project } from '~/types/project'
import type { Proof } from '~/types/proof'

interface ProjectSlice {
  project: Project | null
  proofs: Proof[]
  expressions: ExpressionsResponse
  setProject: (project: Project) => void
  setProofs: (proofs: Proof[]) => void
  setExpressions: (expression: ExpressionsResponse) => void
}

const createStore = () => {
  return create<ProjectSlice>((set) => {
    return {
      project: null,
      proofs: [],
      expressions: {
        base_expressions: [],
        final_expressions: [],
      },
      setProject(project) {
        set({ project })
      },
      setProofs(proofs) {
        set({ proofs })
      },
      setExpressions(expressions) {
        set({ expressions })
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
