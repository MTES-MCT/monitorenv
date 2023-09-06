import { useCallback } from 'react'
import styled from 'styled-components'

import { displayControlUnitResourcesFromControlUnit, displayBaseNamesFromControlUnit } from './utils'
import { globalActions } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { mapControlUnitDialogActions } from '../MapControlUnitDialog/slice'

import type { ControlUnit } from '../../../domain/entities/controlUnit'

export type ItemProps = {
  controlUnit: ControlUnit.ControlUnit
}
export function Item({ controlUnit }: ItemProps) {
  const dispatch = useAppDispatch()

  const edit = useCallback(() => {
    dispatch(mapControlUnitDialogActions.setControlUnitId(controlUnit.id))
    dispatch(
      globalActions.setDisplayedItems({
        isControlUnitDialogVisible: true,
        isControlUnitListDialogVisible: false
      })
    )
  }, [controlUnit.id, dispatch])

  return (
    <Wrapper onClick={edit}>
      <NameText>{controlUnit.name}</NameText>
      <AdministrationText>{controlUnit.administration.name}</AdministrationText>
      <ResourcesAndPortsText>{displayControlUnitResourcesFromControlUnit(controlUnit)}</ResourcesAndPortsText>
      <ResourcesAndPortsText>{displayBaseNamesFromControlUnit(controlUnit)}</ResourcesAndPortsText>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  cursor: pointer;
  margin-top: 8px;
  padding: 8px 12px;

  &:hover {
    background-color: ${p => p.theme.color.lightGray};
  }
`

const NameText = styled.div`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;
  line-height: 18px;
`

const AdministrationText = styled.div`
  color: ${p => p.theme.color.gunMetal};
  line-height: 18px;
  margin: 2px 0 8px;
`

const ResourcesAndPortsText = styled.div`
  color: ${p => p.theme.color.slateGray};
  line-height: 18px;
`
