import { BackButton } from '~/components/back-button'
import { EditFinalExpressionForm } from '~/components/final-expression-form/edit-final-expression-form'

const ExpressionPage = ({ params }: { params: { id: string; expressionId: string } }) => {
  return (
    <section className='flex w-full flex-col gap-6 px-7 pt-10 lg:container lg:w-[816px] lg:pt-[64px]'>
      <div className='flex w-full flex-col gap-[60px] lg:gap-10'>
        <BackButton />
        <div className='flex flex-col items-center gap-6 lg:gap-4'>
          <p className='text-xl font-medium lg:text-2xl lg:font-bold'>Edit Final Expression</p>
          <EditFinalExpressionForm projectId={params.id} expressionId={params.expressionId} />
        </div>
      </div>
    </section>
  )
}

export default ExpressionPage
