import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { OneTimeCalculation } from './one-time-calculation'
import { PeriodicCalculation } from './periodic-calculation'

export const CalculationsTabs = ({ expressionId }: { expressionId: number }) => {
  return (
    <Tabs defaultValue='one_time' className=''>
      <TabsList className='mb-6 w-full'>
        <TabsTrigger value='one_time' className='w-full data-[state=active]:bg-transparent'>
          One time calculation
        </TabsTrigger>
        <TabsTrigger value='periodic' className='w-full data-[state=active]:bg-transparent'>
          Periodic calculation
        </TabsTrigger>
      </TabsList>
      <TabsContent value='one_time' className='flex flex-col gap-10'>
        <OneTimeCalculation expressionId={expressionId} />
      </TabsContent>
      <TabsContent value='periodic' className='flex flex-col gap-10'>
        <PeriodicCalculation expressionId={expressionId} />
      </TabsContent>
    </Tabs>
  )
}
