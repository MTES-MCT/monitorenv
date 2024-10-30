import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'

export function DateCell({ date, withoutTime = false }: { date: string; withoutTime?: boolean }) {
  const formattedDate = getDateAsLocalizedStringVeryCompact(date, withoutTime)

  return <span>{formattedDate}</span>
}
