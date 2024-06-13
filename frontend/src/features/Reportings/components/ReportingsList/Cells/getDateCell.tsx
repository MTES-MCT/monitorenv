import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'

export function getDateCell(date: string) {
  if (!date) {
    return 'Non saisie'
  }

  return <div>{getDateAsLocalizedStringVeryCompact(date)}</div>
}
