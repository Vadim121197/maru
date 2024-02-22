'use client'

import { useRouter } from 'next/navigation'
import { useProject } from '../ProjectProvider'
import { DangerZone } from './danger-zone'
import { UpdateProject } from './update-project'

export const SettingsTab = ({ projectId }: { projectId: string }) => {
  const { isUserProject, project } = useProject()((state) => state)
  const navigate = useRouter()

  if (!project) return <></>

  if (!isUserProject) {
    navigate.push(`/projects/${projectId}`)
    return
  }

  return (
    <div className='grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6'>
      <UpdateProject />
      <DangerZone />
    </div>
  )
}
