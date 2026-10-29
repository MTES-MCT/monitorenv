/* eslint-disable typescript-sort-keys/string-enum */

export enum PeriodFilter {
  ONE_MONTH = 'Il y a plus d’un mois',
  SIX_MONTHS = 'Il y a plus de 6 mois',
  ONE_YEAR = 'Il y a plus d’un an',
  CUSTOM = 'Période spécifique'
}

export enum RegHelperFilter {
  WITHOUT_THEME = 'Reg. sans thématique associée',
  WITHOUT_TAG = 'Reg. sans tag associée',
  OUTDATED = 'Reg. dont la date de validité est dépassée'
}
