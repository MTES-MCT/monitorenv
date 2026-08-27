import { getLocalizedDayjs } from '@mtes-mct/monitor-ui'

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
