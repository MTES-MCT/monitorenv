import { getDateAsLocalizedStringCompact } from '../../../../utils/getDateAsLocalizedString'

export function getDateCell(date: string) {
  if (!date) {
    return 'Non saisie'
  }

  return getDateAsLocalizedStringCompact(date)
}
