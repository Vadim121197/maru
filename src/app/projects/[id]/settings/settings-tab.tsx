import { DangerZone } from './danger-zone'
import { UpdateProject } from './update-project'

export const SettingsTab = () => {
  return (
    <div className='grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6'>
      <UpdateProject />
      <DangerZone />
    </div>
  )
}
