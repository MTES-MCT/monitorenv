import { customDayjs } from '@mtes-mct/monitor-ui'

import { VigilanceArea } from './types'

export const endingOccurenceText = (endingCondition?: VigilanceArea.EndingCondition, computedEndDate?: string) => {
  if (!endingCondition) {
    return ''
  }

  if (endingCondition === VigilanceArea.EndingCondition.NEVER) {
    return 'Pas de fin de récurrence'
  }

  if (!computedEndDate) {
    return ''
  }

  return `Fin le ${customDayjs(computedEndDate).utc().format('DD/MM/YYYY')}`
}

export const frequencyText = (frequency?: VigilanceArea.Frequency) => {
  switch (frequency) {
    case VigilanceArea.Frequency.ALL_YEARS:
      return 'Se répète tous les ans'
    case VigilanceArea.Frequency.ALL_MONTHS:
      return 'Se répète tous les mois'
    case VigilanceArea.Frequency.ALL_WEEKS:
      return 'Se répète toutes les semaines'
    case VigilanceArea.Frequency.NONE:
    default:
      return ''
  }
}
