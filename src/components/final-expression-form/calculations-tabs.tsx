import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { OneTimeCalculation } from './one-time-calculation'
import { PeriodicCalculation } from './periodic-calculation'

export const CalculationsTabs = ({ expressionId }: { expressionId: number }) => {
  return (
    <Tabs defaultValue='periodic' className=''>
      <TabsList className='mb-10 w-full'>
        <TabsTrigger value='one_time' className='w-full data-[state=active]:bg-transparent'>
          One time calculation
        </TabsTrigger>
        <TabsTrigger value='periodic'  className='w-full data-[state=active]:bg-transparent'>
          Periodic calculation
        </TabsTrigger>
      </TabsList>
      <TabsContent value='one_time' className='flex flex-col gap-[60px]'>
        <OneTimeCalculation expressionId={expressionId} />
      </TabsContent>
      <TabsContent value='periodic' className='flex flex-col gap-[60px]'>
        <PeriodicCalculation expressionId={expressionId} />
      </TabsContent>
    </Tabs>
  )
}
