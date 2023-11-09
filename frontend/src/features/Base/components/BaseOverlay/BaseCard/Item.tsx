import styled from 'styled-components'

import { displayControlUnitResourcesFromControlUnit } from './utils'
import { globalActions } from '../../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { controlUnitDialogActions } from '../../../../ControlUnit/components/ControlUnitDialog/slice'

import type { ControlUnit } from '../../../../../domain/entities/controlUnit'

type ItemProps = {
  controlUnit: ControlUnit.ControlUnit
}
export function Item({ controlUnit }: ItemProps) {
  const dispatch = useAppDispatch()

  const edit = () => {
    dispatch(controlUnitDialogActions.setControlUnitId(controlUnit.id))
    dispatch(
      globalActions.setDisplayedItems({
        isControlUnitDialogVisible: true,
        isControlUnitListDialogVisible: false
      })
    )
  }

  return (
    <Wrapper onClick={edit}>
      <NameText>{controlUnit.name}</NameText>
      <AdministrationText>{controlUnit.administration.name}</AdministrationText>
      <ResourcesBar>{displayControlUnitResourcesFromControlUnit(controlUnit)}</ResourcesBar>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  cursor: pointer;
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

const ResourcesBar = styled.div`
  line-height: 18px;

  > .Element-Tag:not(:first-child) {
    margin-left: 8px;
  }
`
