import { BackButton } from '~/components/back-button'
import { CreateProjectForm } from '~/components/create-project-form'
import { ImportProjectForm } from '~/components/import-project-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

const ProjectNewPage = () => {
  return (
    <section className='container grid w-[628px] items-center gap-6 md:pt-[70px]'>
      <BackButton />
      <div className='mt-[26px] flex flex-col items-center gap-4'>
        <p className='text-2xl font-bold'>Create Project</p>
        <p className='text-lg font-medium text-muted-foreground'>To get started, try create project</p>
      </div>
      <Tabs defaultValue='new'>
        <TabsList className='mb-6 w-full'>
          <TabsTrigger value='new' className='w-full'>
            New Project
          </TabsTrigger>
          <TabsTrigger value='import' className='w-full' disabled>
            Import
          </TabsTrigger>
        </TabsList>
        <TabsContent value='new'>
          <CreateProjectForm />
        </TabsContent>
        <TabsContent value='import'>
          <ImportProjectForm />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default ProjectNewPage
