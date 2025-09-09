/* eslint-disable typescript-sort-keys/string-enum */
export enum DateRangeEnum {
  CUSTOM = 'CUSTOM',
  DAY = 'DAY',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  YEAR = 'YEAR'
}

export type DateRangeLabel = {
  [K in DateRangeEnum]: {
    label: string
    value: K
  }
}

export const DAY_OPTION = {
  label: "Aujourd'hui",
  value: DateRangeEnum.DAY
}
export const dateRangeOptions = [
  DAY_OPTION,
  {
    label: 'Une semaine',
    value: DateRangeEnum.WEEK
  },
  {
    label: 'Un mois',
    value: DateRangeEnum.MONTH
  },
  {
    label: 'Année en cours',
    value: DateRangeEnum.YEAR
  },
  {
    label: 'Période spécifique',
    value: DateRangeEnum.CUSTOM
  }
]

export enum ReportingDateRangeLabels {
  DAY = '24 dernières heures',
  WEEK = '7 derniers jours',
  MONTH = '30 derniers jours',
  YEAR = 'Année en cours',
  CUSTOM = 'Période spécifique'
}
