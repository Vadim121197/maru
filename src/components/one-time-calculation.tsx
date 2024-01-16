import { Input } from './ui/input'

export const OneTimeCalculation = () => {
  return (
    <form className='flex flex-col gap-[60px] items-center'>
      <div className='grid grid-cols-2 gap-10'>
        <div className='flex flex-col gap-4'>
          <p className='text-base font-medium'>From</p>
          <Input
          // value={repoName}
          // onChange={(e) => {
          //   setRepoName(e.target.value)
          // }}
          />
        </div>
        <div className='flex flex-col gap-4'>
          <p className='text-base font-medium'>To</p>
          <Input
          // value={repoName}
          // onChange={(e) => {
          //   setRepoName(e.target.value)
          // }}
          />
        </div>
      </div>
    </form>
  )
}
