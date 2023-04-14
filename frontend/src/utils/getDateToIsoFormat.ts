import { customDayjs } from '@mtes-mct/monitor-ui'

import type { OpUnitType, QUnitType } from 'dayjs'

export const getDateToIsoFormat = (unit: QUnitType | OpUnitType, date: string) =>
  customDayjs(date).utc().startOf(unit).toISOString()
