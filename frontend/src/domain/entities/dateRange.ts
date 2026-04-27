/* eslint-disable typescript-sort-keys/string-enum */
export enum DateRangeEnum {
  CUSTOM = 'CUSTOM',
  DAY = 'DAY',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  YEAR = 'YEAR',
  UPCOMING = 'UPCOMING'
}

export enum DateRangeLabel {
  CUSTOM = 'Période spécifique',
  DAY = "Aujourd'hui",
  MONTH = 'Un mois',
  WEEK = 'Une semaine',
  YEAR = 'Année en cours',
  UPCOMING = 'À venir'
}

export const DAY_OPTION = {
  label: DateRangeLabel.DAY,
  value: DateRangeEnum.DAY
}
export const dateRangeOptions = [
  DAY_OPTION,
  {
    label: DateRangeLabel.WEEK,
    value: DateRangeEnum.WEEK
  },
  {
    label: DateRangeLabel.MONTH,
    value: DateRangeEnum.MONTH
  },
  {
    label: DateRangeLabel.YEAR,
    value: DateRangeEnum.YEAR
  },
  {
    label: DateRangeLabel.CUSTOM,
    value: DateRangeEnum.CUSTOM
  }
]

export enum ReportingDateRangeLabels {
  DAY = '24 dernières heures',
  WEEK = '7 derniers jours',
  MONTH = '30 derniers jours',
  YEAR = DateRangeLabel.YEAR,
  CUSTOM = DateRangeLabel.CUSTOM
}
