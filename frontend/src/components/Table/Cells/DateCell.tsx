import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'

export function DateCell({ date, withoutTime = false }: { date: string | undefined; withoutTime?: boolean }) {
  if (!date) {
    return <span>-</span>
  }
  const formattedDate = getDateAsLocalizedStringVeryCompact(date, withoutTime)

  return <span>{formattedDate}</span>
}
