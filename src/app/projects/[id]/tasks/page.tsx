import { TasksTab } from './tasks-tab'

const TasksPage = ({ params }: { params: { id: string } }) => {
  return <TasksTab projectId={params.id} />
}

export default TasksPage
