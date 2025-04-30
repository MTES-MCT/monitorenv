import { RecentActivity as RecentActivityType } from '@features/RecentActivity/types'
import { getDatesFromFilters } from '@features/RecentActivity/utils'
import { ControlUnit, customDayjs } from '@mtes-mct/monitor-ui'
import { Page, View } from '@react-pdf/renderer'
import { useMemo } from 'react'

import { RecentActivityByUnit } from './RecentActivityByUnit'
import { Headings } from '../Layout/Headings'
import { layoutStyle } from '../style'

import type { ExportImageType } from '@features/Dashboard/hooks/useExportImages'
import type { RecentActivityFilters } from '@features/RecentActivity/slice'
import type { ControlPlansThemeCollection } from 'domain/entities/controlPlan'

type RecentActivityProps = {
  briefName: string
  controlUnits: ControlUnit.ControlUnit[]
  images: ExportImageType[] | undefined
  recentActivity: RecentActivityType.RecentControlsActivity[]
  recentActivityFilters: RecentActivityFilters
  themes: ControlPlansThemeCollection
}
export function RecentActivity({
  briefName,
  controlUnits,
  images,
  recentActivity,
  recentActivityFilters,
  themes
}: RecentActivityProps) {
  const dates = useMemo(() => {
    if (!recentActivityFilters) {
      return undefined
    }
    const startAfterFilter = recentActivityFilters.startedAfter
    const startBeforeFilter = recentActivityFilters.startedBefore
    const { startAfter, startBefore } = getDatesFromFilters({
      periodFilter: recentActivityFilters.periodFilter as RecentActivityType.RecentActivityDateRangeEnum,
      startAfterFilter,
      startBeforeFilter
    })

    return {
      startAfter: startAfter ? customDayjs(startAfter).format('DD/MM/YYYY') : undefined,
      startBefore: startBefore ? customDayjs(startBefore).format('DD/MM/YYYY') : undefined
    }
  }, [recentActivityFilters])

  const totalTarget = recentActivity.reduce((acc, activity) => {
    const { actionNumberOfControls } = activity

    return acc + actionNumberOfControls
  }, 0)

  const themesAndControlActions = useMemo(
    () =>
      recentActivity.reduce((acc, control) => {
        control.themeIds.forEach(themeId => {
          const theme = themes[themeId]?.theme
          if (!theme) {
            return acc
          }
          if (!acc[theme]) {
            acc[theme] = 0
          }
          acc[theme] += 1

          return acc
        })

        return acc
      }, {} as Record<string, number>),
    [recentActivity, themes]
  )

  return (
    <>
      {controlUnits.map(controlUnit => (
        <Page style={layoutStyle.page}>
          <Headings name={briefName} />
          <View style={layoutStyle.section}>
            <View key={controlUnit.id} break wrap={false}>
              <RecentActivityByUnit
                controlUnit={controlUnit}
                controlUnits={controlUnits}
                dates={dates}
                filters={recentActivityFilters}
                images={images}
                recentActivity={recentActivity}
                themes={themes}
                themesAndControlActions={themesAndControlActions}
                totalTarget={totalTarget}
              />
            </View>
          </View>
        </Page>
      ))}
    </>
  )
}
