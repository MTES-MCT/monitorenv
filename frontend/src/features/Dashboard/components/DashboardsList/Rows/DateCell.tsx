import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'

export function DateCell({ date }: { date: string }) {
  const formattedDate = getDateAsLocalizedStringVeryCompact(date)

  return <span>{formattedDate}</span>
}
