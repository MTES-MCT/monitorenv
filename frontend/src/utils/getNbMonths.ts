import { customDayjs } from '@mtes-mct/monitor-ui'

export function getNbMonths(date: string | undefined) {
  const now = customDayjs().utc()
  const validatedAt = customDayjs(date).utc()

  return (
    (now.year() - validatedAt.year()) * 12 +
    now.month() -
    validatedAt.month() -
    (validatedAt.date() > now.date() ? 1 : 0)
  )
}
