import { DateRangeEnum, DateRangeLabel, DAY_OPTION } from 'domain/entities/dateRange'

export enum MissionDateRangeLabel {
  CUSTOM = DateRangeLabel.CUSTOM,
  DAY = DateRangeLabel.DAY,
  MONTH = '30 derniers jours',
  WEEK = '7 derniers jours',
  YEAR = DateRangeLabel.YEAR,
  UPCOMING = DateRangeLabel.UPCOMING
}

export const missionDateRangeOptions = [
  DAY_OPTION,
  {
    label: MissionDateRangeLabel.WEEK,
    value: DateRangeEnum.WEEK
  },
  {
    label: MissionDateRangeLabel.MONTH,
    value: DateRangeEnum.MONTH
  },
  {
    label: MissionDateRangeLabel.YEAR,
    value: DateRangeEnum.YEAR
  },
  {
    label: MissionDateRangeLabel.UPCOMING,
    value: DateRangeEnum.UPCOMING
  },
  {
    label: MissionDateRangeLabel.CUSTOM,
    value: DateRangeEnum.CUSTOM
  }
]
