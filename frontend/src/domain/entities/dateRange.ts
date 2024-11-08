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
export const DATE_RANGE_LABEL: DateRangeLabel = {
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  DAY: {
    label: 'Aujourd’hui',
    value: DateRangeEnum.DAY
  },
  WEEK: {
    label: 'Une semaine',
    value: DateRangeEnum.WEEK
  },
  MONTH: {
    label: 'Un mois',
    value: DateRangeEnum.MONTH
  },
  YEAR: {
    label: 'Année en cours',
    value: DateRangeEnum.YEAR
  },
  CUSTOM: {
    label: 'Période spécifique',
    value: DateRangeEnum.CUSTOM
  }
  /* eslint-enable sort-keys-fix/sort-keys-fix */
}

export enum ReportingDateRangeEnum {
  CUSTOM = 'CUSTOM',
  DAY = 'DAY',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  YEAR = 'YEAR'
}

export enum ReportingDateRangeLabels {
  DAY = '24 dernières heures',
  WEEK = '7 derniers jours',
  MONTH = '30 derniers jours',
  YEAR = 'Année en cours',
  CUSTOM = 'Période spécifique'
}
