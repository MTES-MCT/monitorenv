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

export const reportingDateRangeLabels = {
  DAY: {
    label: '24 dernières heures',
    value: 'DAY'
  },
  WEEK: {
    label: '7 dernier jours',
    value: 'WEEK'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  MONTH: {
    label: '30 derniers jours',
    value: 'MONTH'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  YEAR: {
    label: 'Année en cours',
    value: 'YEAR'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  CUSTOM: {
    label: 'Période spécifique',
    value: 'CUSTOM'
  }
}
