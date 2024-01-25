import { BackButton } from '~/components/back-button'
import { BaseExpressionForm } from '~/components/base-expression-form'

const CreateProjectExpressionPage = ({ params }: { params: { id: string } }) => {
  return (
    <section
      className='flex w-full flex-col gap-6 px-7 pt-10 lg:container lg:w-[816px] lg:pt-[64px]'
    >
      <div className='flex w-full flex-col gap-[60px] lg:gap-10'>
        <BackButton />
        <div className='flex flex-col items-center gap-6 lg:gap-4'>
          <p className='text-xl font-medium lg:text-2xl lg:font-bold'>Create Expression</p>
          <BaseExpressionForm projectId={params.id} />
        </div>
      </div>
    </section>
  )
}

export default CreateProjectExpressionPage
