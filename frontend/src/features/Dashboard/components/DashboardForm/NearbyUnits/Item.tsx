import { Bold } from '@components/style'
import { FirstLine, ResourcesAndPortsText } from '@features/Dashboard/components/DashboardForm/ControlUnits/Item'
import { dashboardActions } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, pluralize, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { getDateRange } from './utils'
import { getPinIcon, getSelectionStateNearbyUnit } from '../ToggleSelectAll/utils'

import type { NearbyUnit } from '@features/Dashboard/components/DashboardForm/NearbyUnits/types'

export function Item({ isSelected = false, nearbyUnit }: { isSelected?: boolean; nearbyUnit: NearbyUnit }) {
  const dispatch = useAppDispatch()

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const selectedNearbyUnits = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.selectedNearbyUnits : []
  )
  const isPinned = selectedNearbyUnits
    ?.map(selectedNearbyUnit => selectedNearbyUnit.controlUnit.id)
    ?.includes(nearbyUnit.controlUnit.id)

  const selectNearbyUnit = () => {
    if (isPinned) {
      dispatch(dashboardActions.removeNearbyUnitsFromSelection([nearbyUnit]))
    } else {
      dispatch(dashboardActions.addNearbyUnitsToSelection([nearbyUnit]))
    }
  }

  const maxRangeMissionDate = getDateRange(nearbyUnit.missions)

  const topicSelectionState = getSelectionStateNearbyUnit(nearbyUnit, selectedNearbyUnits ?? [])

  const handleSelectedNearbyUnit = () => {
    if (topicSelectionState === 'ALL') {
      dispatch(dashboardActions.removeNearbyUnitsFromSelection([nearbyUnit]))
    } else if (topicSelectionState === 'PARTIAL') {
      dispatch(dashboardActions.removeNearbyUnitsFromSelection([nearbyUnit]))
      dispatch(dashboardActions.addNearbyUnitsToSelection([nearbyUnit]))
    } else {
      dispatch(dashboardActions.addNearbyUnitsToSelection([nearbyUnit]))
    }
  }

  return (
    <Wrapper
      $isSelected={isSelected}
      data-cy={`dashboard-${isSelected ? 'selected' : ''}-nearby-unit-${nearbyUnit.controlUnit.id}`}
    >
      <FirstLine>
        <UnitDesignation>
          <Bold>{nearbyUnit.controlUnit.name} </Bold>
          <span>{nearbyUnit.controlUnit.administration}</span>
        </UnitDesignation>
        {isSelected ? (
          <IconButton
            accent={Accent.TERTIARY}
            aria-label="Retirer l'unité de la sélection"
            color={THEME.color.slateGray}
            Icon={Icon.Close}
            onClick={selectNearbyUnit}
            title="Retirer l'unité de la sélection"
          />
        ) : (
          <>
            {getPinIcon(
              topicSelectionState,
              handleSelectedNearbyUnit,
              `Sélectionner l'unité ${nearbyUnit.controlUnit.name}`
            )}
          </>
        )}
      </FirstLine>

      {!isSelected && (
        <ResourcesAndPortsText>
          {nearbyUnit.missions.length} {pluralize('mission', nearbyUnit.missions.length)} •{' '}
          {maxRangeMissionDate?.start ? `Du ${maxRangeMissionDate?.start}` : ''}{' '}
          {maxRangeMissionDate?.end ? `au ${maxRangeMissionDate?.end}` : ''}
        </ResourcesAndPortsText>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.li<{ $isSelected: boolean }>`
  background-color: ${p => (p.$isSelected ? p.theme.color.white : p.theme.color.gainsboro)};
  padding: ${p => (p.$isSelected ? '10px 16px' : '16px')};
`

export const UnitDesignation = styled.span`
  display: flex;
  gap: 16px;
`
