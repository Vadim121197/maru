import { ProofsTab } from './proofs-tab'

const ProjectPage = ({ params }: { params: { id: string } }) => {
  return <ProofsTab projectId={params.id} />
}

export default ProjectPage
