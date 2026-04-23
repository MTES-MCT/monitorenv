import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'

export function DateCell({
  date,
  format = 'DD/MM/YY',
  withoutTime = false
}: {
  date: string | undefined
  format?: string
  withoutTime?: boolean
}) {
  if (!date) {
    return <span>-</span>
  }
  const formattedDate = getDateAsLocalizedStringVeryCompact(date, withoutTime, false, format)

  return <span>{formattedDate}</span>
}
