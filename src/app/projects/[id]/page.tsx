import { MoveRight, PlusIcon } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { authOptions } from '~/auth'
import { buttonVariants } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { AxiosRoutes, axiosInstance } from '~/lib/axios-instance'
import { expressionTypeLabels, expressionTypes } from '~/lib/expressions'
import { cn } from '~/lib/utils'
import type { Expression } from '~/types/expressions'
import { Nav } from '~/types/nav'
import { type Project } from '~/types/project'

const ProjectPage = async ({ params }: { params: { id: string } }) => {
  try {
    const session = await getServerSession(authOptions)

    const { data: project } = await axiosInstance.get<Project>(`${AxiosRoutes.PROJECTS}/${params.id}`)

    const { data: projectExpressions } = await axiosInstance.get<Expression[]>(
      `${AxiosRoutes.PROJECTS}/${params.id}/expressions`,
    )

    return (
      <section className='container grid items-center md:pt-[84px]'>
        <div className='flex flex-col md:gap-6'>
          <div className='flex items-center justify-between'>
            <p className='text-2xl font-bold'>{project.repo_url}</p>
            {session && session.user.id === project.user.id && (
              <div className='flex gap-[22px]'>
                <Dialog>
                  <DialogTrigger
                    className={cn(
                      'md:w-[196px] gap-[10px]',
                      buttonVariants({
                        variant: 'outline',
                      }),
                    )}
                  >
                    <PlusIcon className='h-4 w-4 text-white' />
                    <span>Add Expession</span>
                  </DialogTrigger>
                  <DialogContent className='w-[520px]'>
                    <DialogHeader>
                      <DialogTitle>Add Expression</DialogTitle>
                    </DialogHeader>
                    <div className='grid grid-cols-2 gap-x-9 gap-y-6 px-6 pb-4 pt-6'>
                      {expressionTypes.map((exp) => (
                        <Link
                          href={!exp.disabled ? `${Nav.PROJECTS}/${params.id}/expression/${exp.type}` : {}}
                          key={exp.type}
                          className={cn('flex gap-4 max-w-fit', exp.disabled ? 'cursor-not-allowed' : 'group')}
                        >
                          <p className='text-base font-semibold text-muted-foreground group-hover:text-muted'>
                            {expressionTypeLabels[exp.type]}
                          </p>
                          <MoveRight className='h-6 w-6 text-muted-foreground group-hover:text-primary' />
                        </Link>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <Link
                  href={`/projects/${params.id}/calculations`}
                  className={cn('md:w-[196px] gap-[10px]', buttonVariants())}
                >
                  Start Proving
                </Link>
              </div>
            )}
          </div>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center gap-3'>
              {project.user.avatar_url && (
                <Image src={project.user.avatar_url} width={24} height={24} className='rounded-full' alt='avatar' />
              )}
              <p className='text-sm font-medium lg:text-base'>{project.user.username}</p>
            </div>
            <div className='flex gap-[85px]'>
              <div className='flex flex-col gap-2'>
                <p className='text-lg font-medium'>Description</p>
                <p className='text-lg font-medium text-muted-foreground'>{project.description}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-lg font-medium'>Tags</p>
                {project.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className='border-2 border-border bg-background px-[26px] py-[5px] text-[12px] font-normal leading-[18px] text-muted-foreground'
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Tabs defaultValue='expression'>
            <TabsList className='mb-10'>
              <TabsTrigger value='expression'>Expression</TabsTrigger>
              <TabsTrigger value='deployment'>Deployment</TabsTrigger>
            </TabsList>
            <TabsContent value='expression' className='grid grid-cols-2 gap-6'>
              {projectExpressions.map((expr) => (
                <div key={expr.id} className='flex w-full flex-col gap-6'>
                  <p className='text-base font-medium'>{expr.name || 'unknown_name'}</p>
                  <div className='border-2 border-border bg-background p-6 text-[12px] font-normal leading-[18px] text-muted-foreground'>
                    {expr.raw_data}
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value='deployment' />
          </Tabs>
        </div>
      </section>
    )
  } catch (error) {}
}

export default ProjectPage
