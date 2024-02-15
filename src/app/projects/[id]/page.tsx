'use client'

import { useEffect, useState } from 'react'
import { ExpressionsTab } from '~/components/expressions-tab'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import { type Project } from '~/types/project'

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const axiosAuth = useAxiosAuth()

  const [project, setProject] = useState<Project | undefined>()

  useEffect(() => {
    if (!params.id) return

    void (async () => {
      try {
        const { data: project } = await axiosAuth.get<Project>(
          ApiRoutes.PROJECTS_PROJECT_ID.replace(PROJECT_ID, params.id),
        )

        setProject(project)
      } catch (error) {}
    })()
  }, [params.id, axiosAuth])

  if (!project) return

  return (
    <ExpressionsTab
      project={project}
      updateProject={(newProject) => {
        setProject(newProject)
      }}
    />
  )
}

export default ProjectPage
