import { DeploymentsTab } from './deployments-tab'

const DeploymentPage = ({ params }: { params: { id: string } }) => {
  return <DeploymentsTab projectId={params.id} />
}

export default DeploymentPage
