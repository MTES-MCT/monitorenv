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
  images: ExportImageType[] | undefined
  recentActivity: RecentActivityType.RecentControlsActivity[]
  recentActivityControlUnits: ControlUnit.ControlUnit[]
  recentActivityFilters: RecentActivityFilters
  selectedControlUnits: ControlUnit.ControlUnit[]
  themes: ControlPlansThemeCollection
}
export function RecentActivity({
  briefName,
  images,
  recentActivity,
  recentActivityControlUnits,
  recentActivityFilters,
  selectedControlUnits,
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
          const theme = themes[themeId]?.theme ?? 'Thématique non renseignée'
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
      {selectedControlUnits && selectedControlUnits.length > 0 ? (
        selectedControlUnits.map(controlUnit => (
          <Page key={controlUnit.id} style={layoutStyle.page}>
            <Headings name={briefName} />
            <View style={layoutStyle.section}>
              <View break wrap={false}>
                <RecentActivityByUnit
                  controlUnit={controlUnit}
                  dates={dates}
                  filters={recentActivityFilters}
                  images={images}
                  recentActivity={recentActivity}
                  recentActivityControlUnits={recentActivityControlUnits}
                  selectedControlUnits={selectedControlUnits}
                  themes={themes}
                  themesAndControlActions={themesAndControlActions}
                  totalTarget={totalTarget}
                />
              </View>
            </View>
          </Page>
        ))
      ) : (
        <Page style={layoutStyle.page}>
          <Headings name={briefName} />
          <View style={layoutStyle.section}>
            <View break wrap={false}>
              <RecentActivityByUnit
                dates={dates}
                filters={recentActivityFilters}
                images={images}
                recentActivity={recentActivity}
                recentActivityControlUnits={recentActivityControlUnits}
                selectedControlUnits={selectedControlUnits}
                themes={themes}
                themesAndControlActions={themesAndControlActions}
                totalTarget={totalTarget}
              />
            </View>
          </View>
        </Page>
      )}
    </>
  )
}
