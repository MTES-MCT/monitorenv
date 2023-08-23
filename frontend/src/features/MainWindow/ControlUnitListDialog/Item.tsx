import styled from 'styled-components'

import { displayControlUnitResourcesFromControlUnit, displayPortNamesFromControlUnit } from './utils'

import type { ControlUnit } from '../../../domain/entities/controlUnit/types'

export type ItemProps = {
  controlUnit: ControlUnit.ControlUnit
}
export function Item({ controlUnit }: ItemProps) {
  return (
    <Wrapper>
      <NameText>{controlUnit.name}</NameText>
      <AdministrationText>{controlUnit.controlUnitAdministration.name}</AdministrationText>
      <ResourcesAndPortsText>{displayControlUnitResourcesFromControlUnit(controlUnit)}</ResourcesAndPortsText>
      <ResourcesAndPortsText>{displayPortNamesFromControlUnit(controlUnit)}</ResourcesAndPortsText>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  margin-top: 8px;
  padding: 8px 12px;
  /* TODO Check monitor-ui <MapMenuDialog.Body /> alignment. */
  /* text-align: left; */
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
