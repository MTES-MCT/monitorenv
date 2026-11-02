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
  periodFilter?: 'ONE_MONTH' | 'SIX_MONTHS' | 'ONE_YEAR' | 'CUSTOM'
  to?: string
}

export function getDatesFromFilters({ from, periodFilter, to }: GetDatesFromFiltersProps) {
  let fromDate = from
  const toDate = to
  switch (periodFilter) {
    case 'ONE_MONTH':
      fromDate = customDayjs().utc().startOf('day').subtract(1, 'month').toISOString()
      break

    case 'SIX_MONTHS':
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
