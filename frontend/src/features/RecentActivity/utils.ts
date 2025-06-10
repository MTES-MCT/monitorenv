import { customDayjs } from '@mtes-mct/monitor-ui'

import { getRecentControlActivityGeometry } from './components/Layers/recentControlActivityGeometryHelper'
import {
  MAX_CONTROLS,
  MIN_CONTROLS,
  RECENT_ACTIVITY_COEFFICIENT,
  RECENT_ACTIVITY_MAX_PIXEL,
  RECENT_ACTIVITY_MIN_PIXEL
} from './constants'
import { RecentActivity } from './types'

import type { Feature } from 'ol'

export function calculateDotSize(totalControls: number): number {
  const minPixel = RECENT_ACTIVITY_MIN_PIXEL
  const maxPixel = RECENT_ACTIVITY_MAX_PIXEL
  const coefficient = RECENT_ACTIVITY_COEFFICIENT

  return (
    RECENT_ACTIVITY_MIN_PIXEL +
    ((Math.log(totalControls + coefficient) - Math.log(MIN_CONTROLS + coefficient)) /
      (Math.log(MAX_CONTROLS + coefficient) - Math.log(MIN_CONTROLS + coefficient))) *
      (maxPixel - minPixel)
  )
}

export function getDatesFromFilters({
  periodFilter,
  startAfterFilter,
  startBeforeFilter
}: {
  periodFilter: RecentActivity.RecentActivityDateRangeEnum
  startAfterFilter?: string
  startBeforeFilter?: string
}) {
  let startAfter = startAfterFilter
  let startBefore = startBeforeFilter
  switch (periodFilter) {
    case RecentActivity.RecentActivityDateRangeEnum.SEVEN_LAST_DAYS:
      startAfter = customDayjs().utc().subtract(7, 'day').startOf('day').toISOString()
      startBefore = customDayjs().utc().endOf('day').toISOString()
      break
    case RecentActivity.RecentActivityDateRangeEnum.THIRTY_LAST_DAYS:
      startAfter = customDayjs().utc().subtract(30, 'day').startOf('day').toISOString()
      startBefore = customDayjs().utc().endOf('day').toISOString()
      break
    case RecentActivity.RecentActivityDateRangeEnum.THREE_LAST_MONTHS:
      startAfter = customDayjs().utc().subtract(3, 'month').startOf('day').toISOString()
      startBefore = customDayjs().utc().endOf('day').toISOString()
      break
    case RecentActivity.RecentActivityDateRangeEnum.CURRENT_YEAR:
      startAfter = customDayjs().utc().startOf('year').toISOString()
      startBefore = customDayjs().utc().endOf('day').toISOString()
      break
    case RecentActivity.RecentActivityDateRangeEnum.CUSTOM:
      break
    default:
      break
  }

  return {
    startAfter,
    startBefore
  }
}

export function getRecentActivityFeatures(recentControlsActivity, layerName): Feature[] {
  return recentControlsActivity.flatMap(control => {
    if (control.actionNumberOfControls === 0 || !control.actionNumberOfControls) {
      return []
    }
    // total number of controls in action
    const totalControls = control.actionNumberOfControls

    // total number of persons controlled in all infractions
    const totalControlsInInfractions = control.infractions.reduce((acc, infraction) => acc + infraction.nbTarget, 0)

    const ratioInfractionsInControls = (totalControlsInInfractions / totalControls) * 100

    const iconSize = calculateDotSize(totalControls)

    return getRecentControlActivityGeometry({
      control,
      iconSize,
      layerName,
      ratioInfractionsInControls
    })
  })
}
