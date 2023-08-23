/* eslint-disable typescript-sort-keys/string-enum */
export enum DateRangeEnum {
  CUSTOM = 'CUSTOM',
  DAY = 'DAY',
  MONTH = 'MONTH',
  WEEK = 'WEEK'
}

export const dateRangeLabels = {
  DAY: {
    label: 'Aujourd’hui',
    value: 'DAY'
  },
  WEEK: {
    label: 'Une semaine',
    value: 'WEEK'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  MONTH: {
    label: 'Un mois',
    value: 'MONTH'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  CUSTOM: {
    label: 'Période spécifique',
    value: 'CUSTOM'
  }
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
