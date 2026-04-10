export const revalidate = 3600

import { getSchools, getServiceTypes, getPricesWithDetails } from '@/lib/queries'
import PriceSection from '@/components/PriceSection'
import CostCalculator from '@/components/CostCalculator'

export default async function PriserPage() {
  const [schools, serviceTypes, prices] = await Promise.all([
    getSchools(),
    getServiceTypes(),
    getPricesWithDetails(),
  ])

  return (
    <main>
      <PriceSection serviceTypes={serviceTypes} prices={prices} schools={schools} />
      <CostCalculator schools={schools} />
    </main>
  )
}
