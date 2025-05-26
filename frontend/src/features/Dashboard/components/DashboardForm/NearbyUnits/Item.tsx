import { Bold } from '@components/style'
import {
  ControlUnitName,
  FirstLine,
  ResourcesAndPortsText
} from '@features/Dashboard/components/DashboardForm/ControlUnits/Item'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, pluralize, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { getDateRange } from './utils'

import type { NearbyUnit } from '@api/nearbyUnitsAPI'

export function Item({ isSelected = false, nearbyUnit }: { isSelected?: boolean; nearbyUnit: NearbyUnit }) {
  const dispatch = useAppDispatch()

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const selectedNearbyUnitIds = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.selectedNearbyUnitIds : []
  )
  const isPinned = selectedNearbyUnitIds?.includes(nearbyUnit.controlUnit.id)

  const selectNearbyUnit = () => {
    if (isPinned) {
      dispatch(
        dashboardActions.removeItems({ itemIds: [nearbyUnit.controlUnit.id], type: Dashboard.Block.NEARBY_UNITS })
      )
    } else {
      dispatch(dashboardActions.addItems({ itemIds: [nearbyUnit.controlUnit.id], type: Dashboard.Block.NEARBY_UNITS }))
    }
  }

  const missionsDates = getDateRange(nearbyUnit.missions)

  return (
    <Wrapper $isSelected={isSelected} data-cy={`dashboard-nearby-unit-${nearbyUnit.controlUnit.id}`}>
      <FirstLine>
        <ControlUnitName>
          <Bold>{nearbyUnit.controlUnit.name} - </Bold>
          {nearbyUnit.controlUnit.administration}
        </ControlUnitName>
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
          <IconButton
            accent={Accent.TERTIARY}
            color={isPinned ? THEME.color.blueGray : THEME.color.slateGray}
            data-cy={`dashboard-nearby-unit-selected-${nearbyUnit.controlUnit.id}`}
            Icon={isPinned ? Icon.PinFilled : Icon.Pin}
            onClick={selectNearbyUnit}
            title="Sélectionner la zone"
          />
        )}
      </FirstLine>

      {!isSelected && (
        <ResourcesAndPortsText>
          {nearbyUnit.missions.length} {pluralize('mission', nearbyUnit.missions.length)} •{' '}
          {missionsDates?.start ? `Du ${missionsDates?.start}` : ''}{' '}
          {missionsDates?.end ? `au ${missionsDates?.end}` : ''}
        </ResourcesAndPortsText>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.li<{ $isSelected: boolean }>`
  background-color: ${p => (p.$isSelected ? p.theme.color.white : p.theme.color.gainsboro)};
  padding: ${p => (p.$isSelected ? '10px 16px' : '16px')};
`
