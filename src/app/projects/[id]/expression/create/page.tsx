import { BackButton } from '~/components/back-button'
import { BaseExpressionForm } from '~/components/base-expression-form'

const CreateProjectExpressionPage = ({ params }: { params: { id: string } }) => {
  return (
    <section className='flex w-full flex-col items-center px-7 lg:container lg:w-[816px] lg:pt-[64px]'>
      <div className='flex w-full flex-col lg:gap-10'>
        <BackButton />
        <div className='flex flex-col items-center gap-4'>
          <p className='text-2xl font-bold'>Create Expression</p>
          <BaseExpressionForm projectId={params.id} />
        </div>
      </div>
    </section>
  )
}

export default CreateProjectExpressionPage
