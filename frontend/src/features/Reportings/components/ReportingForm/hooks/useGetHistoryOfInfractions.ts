import { useLazyGetEnvActionsByMmsiQuery, useLazyGetSuspicionOfInfractionsQuery } from '@api/infractionsAPI'
import { getTotalInfraction, getTotalPV } from '@features/Mission/utils'
import { isNewReporting } from '@features/Reportings/utils'

import type { EnvActionControlWithInfractions } from 'domain/entities/missions'
import type { SuspicionOfInfractions } from 'domain/entities/reporting'

type UseGetHistoryOfInfractionsProps = {
  canSearch: boolean
  mmsi: string
  reportingId: string | number
}

export type HistoryOfInfractionsProps = {
  envActions: EnvActionControlWithInfractions[]
  isLoading: boolean
  suspicionOfInfractions: SuspicionOfInfractions[]
  totalInfraction: number
  totalPV: number
}

export const initialHistory: HistoryOfInfractionsProps = {
  envActions: [],
  isLoading: true,
  suspicionOfInfractions: [],
  totalInfraction: 0,
  totalPV: 0
}

export const useGetHistoryOfInfractions = () => {
  const [getEnvActionsByMmsi, { isLoading: isLoadingLazyEnvActions }] = useLazyGetEnvActionsByMmsiQuery()
  const [getSuspicionOfInfractions, { isLoading: isLoadingLazySuspicions }] = useLazyGetSuspicionOfInfractionsQuery()

  const getHistoryByMmsi = async ({
    mmsi,
    reportingId
  }: UseGetHistoryOfInfractionsProps): Promise<HistoryOfInfractionsProps | undefined> => {
    if (!mmsi) {
      return initialHistory
    }

    let envActionsByMmsi
    let suspicionOfInfractionsByMmsi
    if (mmsi) {
      envActionsByMmsi = await getEnvActionsByMmsi(mmsi).unwrap()
      suspicionOfInfractionsByMmsi = await getSuspicionOfInfractions({
        idToExclude: isNewReporting(reportingId) ? undefined : +reportingId,
        mmsi
      }).unwrap()
    }

    const totalInfraction = getTotalInfraction(envActionsByMmsi ?? [])

    const totalPV = getTotalPV(envActionsByMmsi ?? [])

    return {
      envActions: envActionsByMmsi ?? [],
      isLoading: isLoadingLazyEnvActions || isLoadingLazySuspicions,
      suspicionOfInfractions: suspicionOfInfractionsByMmsi,
      totalInfraction: totalInfraction ?? 0,
      totalPV: totalPV ?? 0
    }
  }

  return getHistoryByMmsi
}
