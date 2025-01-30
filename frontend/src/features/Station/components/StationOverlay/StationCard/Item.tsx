import { controlUnitDialogActions } from '@features/ControlUnit/components/ControlUnitDialog/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { type ControlUnit } from '@mtes-mct/monitor-ui'
import { globalActions } from 'domain/shared_slices/Global'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'
import styled from 'styled-components'

import { displayControlUnitResourcesFromControlUnit } from './utils'

type ItemProps = {
  controlUnit: ControlUnit.ControlUnit
  onClose: () => void
  stationId: number
}
export function Item({ controlUnit, onClose, stationId }: ItemProps) {
  const dispatch = useAppDispatch()

  const edit = () => {
    dispatch(controlUnitDialogActions.setControlUnitId(controlUnit.id))
    dispatch(
      globalActions.setDisplayedItems({
        visibility: { isControlUnitDialogVisible: true, isControlUnitListDialogVisible: false }
      })
    )
    dispatch(closeAllOverlays())
    onClose()
  }

  return (
    <Wrapper onClick={edit}>
      <NameText title={controlUnit.administration.name}>{controlUnit.name}</NameText>
      <AdministrationText title={controlUnit.administration.name}>{controlUnit.administration.name}</AdministrationText>
      <ResourcesBar>{displayControlUnitResourcesFromControlUnit(controlUnit, stationId)}</ResourcesBar>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  cursor: pointer;
  padding: 8px 4px 0 12px;

  &:hover {
    background-color: ${p => p.theme.color.lightGray};
  }
`

const NameText = styled.div`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;
  line-height: 18px;
  margin-right: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const AdministrationText = styled.div`
  color: ${p => p.theme.color.gunMetal};
  line-height: 18px;
  margin: 2px 4px 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ResourcesBar = styled.div`
  display: flex;
  flex-wrap: wrap;

  > .Element-Tag {
    margin: 0 8px 8px 0;
    white-space: nowrap;
  }
`
