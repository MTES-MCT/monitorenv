import { customDayjs, getLocalizedDayjs } from '@mtes-mct/monitor-ui'

export function formatLayerName(layerName?: string, place?: string) {
  return [layerName, place].filter(Boolean).join(' - ')
}

export const getPeriodText = (startDate, endDate) => {
  const startDateFormatted = startDate ? getLocalizedDayjs(startDate).format('DD/MM/YYYY') : undefined
  const endDateFormatted = endDate ? getLocalizedDayjs(endDate).format('DD/MM/YYYY') : undefined

  if (!startDateFormatted && !endDateFormatted) {
    return undefined
  }

  if (startDateFormatted && !endDateFormatted) {
    return (
      <>
        En vigueur depuis <span>{startDateFormatted}</span>
      </>
    )
  }

  if (!startDateFormatted && endDateFormatted) {
    return (
      <>
        En vigueur jusqu&apos;au <span>{endDateFormatted}</span>
      </>
    )
  }

  return (
    <>
      En vigueur depuis <span>{startDateFormatted}</span> jusqu&apos;au <span>{endDateFormatted}</span>
    </>
  )
}
type GetDatesFromFiltersProps = {
  from?: string
  periodFilter?: '1_MONTH' | '6_MONTHS' | 'ONE_YEAR' | 'CUSTOM'
  to?: string
}

export function getDatesFromFilters({ from, periodFilter, to }: GetDatesFromFiltersProps) {
  let fromDate = from ?? undefined
  const toDate = to ?? undefined
  switch (periodFilter) {
    case '1_MONTH':
      fromDate = customDayjs().utc().startOf('day').subtract(1, 'month').toISOString()
      break

    case '6_MONTHS':
      fromDate = customDayjs().utc().startOf('day').subtract(6, 'month').toISOString()
      break

    case 'ONE_YEAR':
      fromDate = customDayjs().utc().startOf('day').subtract(1, 'year').toISOString()
      break

    case 'CUSTOM':
    default:
      break
  }

  return { from: fromDate, to: toDate }
}
