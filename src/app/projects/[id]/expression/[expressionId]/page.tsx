import { BackButton } from '~/components/back-button'
import { EditBaseExpressionForm } from '~/components/base-expression-form/edit-base-expression-form'

const ExpressionPage = ({ params }: { params: { id: string; expressionId: string } }) => {
  return (
    <section className='flex w-full flex-col items-center px-7 lg:container lg:w-[816px] lg:pt-[64px]'>
      <div className='flex w-full flex-col lg:gap-10'>
        <BackButton />
        <div className='flex flex-col items-center gap-4'>
          <p className='text-2xl font-bold'>Edit Expression</p>
          <EditBaseExpressionForm expressionId={params.expressionId} />
        </div>
      </div>
    </section>
  )
}

export default ExpressionPage
