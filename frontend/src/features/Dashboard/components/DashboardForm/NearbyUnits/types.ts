import type { LegacyControlUnit } from '../../../../../domain/entities/legacyControlUnit'
import type { Mission } from '../../../../../domain/entities/missions'

export enum NearbyUnitDateRangeEnum {
  CUSTOM = 'CUSTOM',
  FOURTEEN_LAST_DAYS = 'FOURTEEN_LAST_DAYS',
  NEXT_OR_LAST_SEVEN_DAYS = 'NEXT_OR_LAST_SEVEN_DAYS',
  SEVEN_LAST_DAYS = 'SEVEN_LAST_DAYS',
  SEVEN_NEXT_DAYS = 'SEVEN_NEXT_DAYS',
  TODAY = 'TODAY'
}

/* eslint-disable typescript-sort-keys/string-enum */
export enum NearbyUnitDateRangeLabels {
  NEXT_OR_LAST_SEVEN_DAYS = '+ / - 7 jours ',
  SEVEN_NEXT_DAYS = '7 prochains jours',
  TODAY = "Aujourd'hui",
  SEVEN_LAST_DAYS = '7 derniers jours',
  FOURTEEN_LAST_DAYS = '14 derniers jours',
  CUSTOM = 'Période spécifique'
}

export type NearbyUnit = {
  controlUnit: LegacyControlUnit
  missions: Mission[]
}
