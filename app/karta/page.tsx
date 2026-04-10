export const revalidate = 3600

import { getSchools } from '@/lib/queries'
import KartaClient from './KartaClient'

export default async function KartaPage() {
  const schools = await getSchools()
  return <KartaClient schools={schools} />
}
