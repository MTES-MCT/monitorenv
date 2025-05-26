import { Bold } from '@components/style'
import {
  displayBaseNamesFromControlUnit,
  displayControlUnitResourcesFromControlUnit
} from '@features/ControlUnit/utils'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, type ControlUnit, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function Item({ controlUnit }: { controlUnit: ControlUnit.ControlUnit }) {
  const dispatch = useAppDispatch()

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const selectedControlUnitIds = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.dashboard.controlUnitIds : []
  )
  const isSelected = selectedControlUnitIds?.includes(controlUnit.id)

  const selectControlUnit = () => {
    if (isSelected) {
      dispatch(dashboardActions.removeItems({ itemIds: [controlUnit.id], type: Dashboard.Block.CONTROL_UNITS }))
    } else {
      dispatch(dashboardActions.addItems({ itemIds: [controlUnit.id], type: Dashboard.Block.CONTROL_UNITS }))
    }
  }

  return (
    <Wrapper data-cy={`dashboard-control-unit-${controlUnit.id}`}>
      <FirstLine>
        <ControlUnitName>
          <Bold>{controlUnit.name} - </Bold>
          {controlUnit.administration.name}
        </ControlUnitName>
        <IconButton
          accent={Accent.TERTIARY}
          color={isSelected ? THEME.color.blueGray : THEME.color.slateGray}
          data-cy={`dashboard-control-unit-selected-${controlUnit.id}`}
          Icon={isSelected ? Icon.PinFilled : Icon.Pin}
          onClick={selectControlUnit}
          title="Sélectionner la zone"
        />
      </FirstLine>

      <ResourcesAndPortsText>{`${displayControlUnitResourcesFromControlUnit(
        controlUnit
      )} (${displayBaseNamesFromControlUnit(controlUnit)})`}</ResourcesAndPortsText>
    </Wrapper>
  )
}
const Wrapper = styled.li`
  background-color: ${p => p.theme.color.gainsboro};
  padding: 16px;
`
export const FirstLine = styled.div`
  color: ${p => p.theme.color.gunMetal};
  display: flex;
  justify-content: space-between;
`

export const ControlUnitName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const ResourcesAndPortsText = styled.span`
  color: ${p => p.theme.color.slateGray};
`
