import { DateRangeEnum, DAY_OPTION } from 'domain/entities/dateRange'

export const missionDateRangeOptions = [
  DAY_OPTION,
  {
    label: '7 derniers jours',
    value: DateRangeEnum.WEEK
  },
  {
    label: '30 derniers jours',
    value: DateRangeEnum.MONTH
  },
  {
    label: 'Année en cours',
    value: DateRangeEnum.YEAR
  },
  {
    label: 'A venir',
    value: DateRangeEnum.UPCOMING
  },
  {
    label: 'Période spécifique',
    value: DateRangeEnum.CUSTOM
  }
]
