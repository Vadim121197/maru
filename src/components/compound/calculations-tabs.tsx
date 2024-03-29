import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { OneTimeCalculation } from './one-time-calculation'
import { PeriodicCalculation } from './periodic-calculation'

export const CalculationsTabs = ({
  expressionId,
  save,
}: {
  expressionId?: number
  save?: () => Promise<number | undefined>
}) => {
  return (
    <Tabs defaultValue='one_time' className='pt-5 border-t-[1px]'>
      <TabsList className='mb-6 w-full'>
        <TabsTrigger value='one_time' className='w-full data-[state=active]:bg-transparent'>
          One time calculation
        </TabsTrigger>
        <TabsTrigger value='periodic' className='w-full data-[state=active]:bg-transparent'>
          Periodic calculation
        </TabsTrigger>
      </TabsList>
      <TabsContent value='one_time' className='flex flex-col gap-10'>
        <OneTimeCalculation expressionId={expressionId} save={save} />
      </TabsContent>
      <TabsContent value='periodic' className='flex flex-col gap-10'>
        <PeriodicCalculation expressionId={expressionId} save={save} />
      </TabsContent>
    </Tabs>
  )
}
