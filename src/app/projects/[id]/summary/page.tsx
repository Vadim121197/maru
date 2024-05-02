import { SummaryTab } from './summary-tab'

const SummaryPage = ({ params }: { params: { id: string } }) => {
  return <SummaryTab projectId={params.id} />
}

export default SummaryPage
