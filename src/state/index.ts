import { create, type StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { type AuthSlice, createAuthSlice } from './auth'
import { createProjectsSlice, type ProjectsSlice } from './projects'

export interface AllSlices {
  auth: AuthSlice
  projects: ProjectsSlice
}

export type SliceCreator<SliceInterface> = StateCreator<AllSlices, [['zustand/immer', never]], [], SliceInterface>

export const initializeStore = () => {
  return immer((setState, getState: () => AllSlices, store) => ({
    auth: createAuthSlice()(setState, getState, store),
    projects: createProjectsSlice()(setState, getState, store),
  }))
}

export const useStore = create<AllSlices>()(initializeStore())
