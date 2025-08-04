import { useLazyGetEnvActionsByMmsiQuery, useLazyGetSuspicionOfInfractionsQuery } from '@api/infractionsAPI'
import { getAllThemes, getTotalInfraction, getTotalPV } from '@features/Mission/utils'
import { isNewReporting } from '@features/Reportings/utils'
import { uniq } from 'lodash'

type UseGetHistoryOfInfractionsProps = {
  canSearch: boolean
  debouncedMmsi: string
  reportingId: string | number
}

export type HistoryOfInfractionsProps = {
  isLoading: boolean
  suspicionOfInfractions: any
  themes: string[]
  totalInfraction: number
  totalPV: number
}

export const initialHistory: HistoryOfInfractionsProps = {
  isLoading: true,
  suspicionOfInfractions: [],
  themes: [],
  totalInfraction: 0,
  totalPV: 0
}

export const useGetHistoryOfInfractions = () => {
  const [getEnvActionsByMmsi, { isLoading: isLoadingLazyEnvActions }] = useLazyGetEnvActionsByMmsiQuery()
  const [getSuspicionOfInfractions, { isLoading: isLoadingLazySuspicions }] = useLazyGetSuspicionOfInfractionsQuery()

  const getHistoryByMmsi = async ({
    debouncedMmsi,
    reportingId
  }: UseGetHistoryOfInfractionsProps): Promise<HistoryOfInfractionsProps | undefined> => {
    if (!debouncedMmsi) {
      return initialHistory
    }

    let envActionsByMmsi
    let suspicionOfInfractionsByMmsi
    if (debouncedMmsi) {
      envActionsByMmsi = await getEnvActionsByMmsi(debouncedMmsi).unwrap()
      suspicionOfInfractionsByMmsi = await getSuspicionOfInfractions({
        idToExclude: isNewReporting(reportingId) ? undefined : +reportingId,
        mmsi: debouncedMmsi
      }).unwrap()
    }

    const totalInfraction = getTotalInfraction(envActionsByMmsi ?? [])

    const totalPV = getTotalPV(envActionsByMmsi ?? [])

    const themes = uniq([
      ...getAllThemes(envActionsByMmsi ?? []).map(theme => theme.name),
      ...(suspicionOfInfractionsByMmsi?.themes ?? [])
    ])

    return {
      isLoading: isLoadingLazyEnvActions || isLoadingLazySuspicions,
      suspicionOfInfractions: suspicionOfInfractionsByMmsi.ids,
      themes: themes ?? [],
      totalInfraction: totalInfraction ?? 0,
      totalPV: totalPV ?? 0
    }
  }

  return getHistoryByMmsi
}
