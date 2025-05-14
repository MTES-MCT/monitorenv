import { type ExportImageType } from '@features/Dashboard/hooks/useExportImages'
import { Dashboard } from '@features/Dashboard/types'
import { RecentActivity as RecentActivityType } from '@features/RecentActivity/types'
import { type ControlUnit } from '@mtes-mct/monitor-ui'
import { Text, View } from '@react-pdf/renderer'
import { useMemo } from 'react'

import { layoutStyle } from '../style'
import { ControlUnitDetailsView } from './ControlUnitDetailsView'
import { GlobalView } from './GlobalView'
import { recentActivityStyles } from './style'

import type { ThemeFromAPI } from '../../../../../domain/entities/themes'
import type { RecentActivityFilters } from '@features/RecentActivity/slice'

export function RecentActivitySummary({
  controlUnit,
  dates,
  filters,
  images,
  recentActivity,
  recentActivityControlUnits,
  selectedControlUnits,
  themes,
  themesAndControlActions,
  totalTarget
}: {
  controlUnit?: ControlUnit.ControlUnit
  dates:
    | {
        startAfter: string | undefined
        startBefore: string | undefined
      }
    | undefined
  filters: RecentActivityFilters
  images: ExportImageType[] | undefined
  recentActivity: RecentActivityType.RecentControlsActivity[]
  recentActivityControlUnits: ControlUnit.ControlUnit[]
  themes: ThemeFromAPI[]
  selectedControlUnits: ControlUnit.ControlUnit[]
  themesAndControlActions: Record<string, number>
  totalTarget: number
}) {
  const allRecentActivityImage = images?.find(
    img => img.featureId === Dashboard.featuresCode.DASHBOARD_ALL_RECENT_ACTIVITY
  )

  const controlUnitImage = images?.find(
    img => img.featureId === `${Dashboard.featuresCode.DASHBOARD_RECENT_ACTIVITY_BY_UNIT}:${controlUnit?.id}`
  )

  const filteredControls = recentActivity?.filter(control => control.controlUnitIds.some(id => id === controlUnit?.id))

  const controlUnitTotalTarget = filteredControls.reduce((acc, control) => {
    const { actionNumberOfControls } = control

    return acc + actionNumberOfControls
  }, 0)

  const controlUnitThemesAndControlActions = useMemo(
    () =>
      filteredControls.reduce((acc, control) => {
        control.themeIds.forEach(themeId => {
          const theme = themes.find(({ id }) => id === themeId)?.name ?? 'Thématique non renseignée'
          if (!acc[theme]) {
            acc[theme] = 0
          }
          acc[theme] += 1

          return acc
        })

        return acc
      }, {} as Record<string, number>),
    [filteredControls, themes]
  )

  return (
    <>
      <View style={recentActivityStyles.rowContainer}>
        <Text style={recentActivityStyles.header}>Activité récente</Text>
        {selectedControlUnits.length > 1 && <Text style={recentActivityStyles.header}> - {controlUnit?.name}</Text>}
      </View>
      {dates && (
        <Text style={[recentActivityStyles.period, { marginTop: 10 }]}>
          Du {dates.startAfter} au {dates.startBefore} -{' '}
          {RecentActivityType.RecentActivityDateRangeLabels[filters.periodFilter]}
        </Text>
      )}
      <View style={[layoutStyle.definition, { marginBottom: 15, marginTop: 10 }]}>
        <Text>
          Les cercles représentent les actions de contrôle. Une action de contrôle possèdent potentiellement de nombreux
          contrôles sur une même coordonnée, sur la même thématique et sous-thématiques et le même type de cible
          contrôlée.
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <GlobalView
          controlUnits={recentActivityControlUnits}
          globalImage={allRecentActivityImage}
          themesAndControlActions={themesAndControlActions}
          totalControlActions={recentActivity.length}
          totalTarget={totalTarget}
        />
        {controlUnit && (
          <ControlUnitDetailsView
            controlUnit={controlUnit}
            image={controlUnitImage}
            themesAndControlActions={controlUnitThemesAndControlActions}
            totalControlActions={filteredControls.length}
            totalTargetByUnit={controlUnitTotalTarget}
          />
        )}
      </View>
    </>
  )
}
