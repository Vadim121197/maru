import { SettingsTab } from './settings-tab'

const SettingsPage = ({ params }: { params: { id: string } }) => {
  return <SettingsTab projectId={params.id} />
}

export default SettingsPage
a
