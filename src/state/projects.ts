import type { Project } from '~/types/project'
import axiosInterceptorInstance, { AxiosRoutes } from '~/lib/axios-interceptor-instance'
import type { AllSlices, SliceCreator } from '.'

export interface ProjectsSlice {
  userProjects: Project[]
  getUserProjects: () => Promise<void>
}

export const createProjectsSlice = (): SliceCreator<ProjectsSlice> => (set) => {
  return {
    userProjects: [],
    getUserProjects: async () => {
      try {
        const { data: projects } = await axiosInterceptorInstance.get<Project[]>(AxiosRoutes.PROJECTS)

        set((state) => {
          state.projects.userProjects = projects
        })
      } catch {
        set((state) => {
          state.projects.userProjects = []
        })
      }
    },
  }
}

export const projectsSelector = (state: AllSlices) => state.projects
