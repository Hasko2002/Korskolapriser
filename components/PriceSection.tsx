'use client'
import { useState } from 'react'
import PriceComparison from '@/components/PriceComparison'
import type { School, ServiceType, PriceWithDetails } from '@/lib/types'

type Props = {
  serviceTypes: ServiceType[]
  prices: PriceWithDetails[]
  schools: School[]
}

export default function PriceSection({ serviceTypes, prices, schools }: Props) {
  const [cityFilter, setCityFilter] = useState('all')

  return (
    <PriceComparison
      serviceTypes={serviceTypes}
      prices={prices}
      schools={schools}
      cityFilter={cityFilter}
      onCityChange={setCityFilter}
    />
  )
}
