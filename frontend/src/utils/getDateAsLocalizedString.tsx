import { getLocalizedDayjs } from '@mtes-mct/monitor-ui'

export function formatDateLabel(dateLabel: string) {
  return dateLabel.replace(
    /([a-z])([a-zéû]+)\.?$/,
    (_, firstMatch, secondMatch) => `${firstMatch.toLocaleUpperCase()}${secondMatch}`
  )
}

export function getDateAsLocalizedStringExpanded(date: string | undefined) {
  if (!date || date.trim() === '') {
    return undefined
  }
  const dayJsDate = getLocalizedDayjs(date)

  return (
    <>
      <b>{formatDateLabel(dayJsDate.format('DD MMM'))}</b> à {dayJsDate.format('HH:mm')}
    </>
  )
}

export function getDateAsLocalizedStringCompact(date: string | undefined, withUtc = false) {
  if (!date || date.trim() === '') {
    return undefined
  }
  const dayJsDate = getLocalizedDayjs(date)

  return (
    <>
      {formatDateLabel(dayJsDate.format('DD MMM YY'))}, {dayJsDate.format('HH')}h{dayJsDate.format('mm')}{' '}
      {withUtc && '(UTC)'}
    </>
  )
}

export function getDateAsLocalizedStringVeryCompact(date: string | undefined | null, withoutTime = false) {
  if (!date || date.trim() === '') {
    return undefined
  }
  const dayJsDate = getLocalizedDayjs(date)

  if (withoutTime) {
    return <>{formatDateLabel(dayJsDate.format('DD/MM/YY'))}</>
  }

  return (
    <>
      {formatDateLabel(dayJsDate.format('DD/MM/YY'))} à {dayJsDate.format('HH')}h{dayJsDate.format('mm')}
    </>
  )
}
