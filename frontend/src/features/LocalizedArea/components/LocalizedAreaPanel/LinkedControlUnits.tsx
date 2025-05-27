import { Bold } from '@components/style'
import {
  displayBaseNamesFromControlUnit,
  displayControlUnitResourcesFromControlUnit
} from '@features/ControlUnit/utils'
import styled from 'styled-components'

import { SubTitle } from './style'

import type { ControlUnit } from '@mtes-mct/monitor-ui'

export function LinkedControlUnits({ controlUnits }: { controlUnits: ControlUnit.ControlUnit[] }) {
  return (
    <>
      <SubTitle>Unités en lien</SubTitle>
      {controlUnits.map(controlUnit => (
        <Wrapper key={controlUnit.id}>
          <ControlUnitName>
            <Bold>{controlUnit.name} - </Bold>
            {controlUnit.administration.name}
          </ControlUnitName>

          <span>{`${displayControlUnitResourcesFromControlUnit(controlUnit)} (${displayBaseNamesFromControlUnit(
            controlUnit
          )})`}</span>
        </Wrapper>
      ))}
    </>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  color: ${p => p.theme.color.gunMetal};
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 16px;
  flex-direction: column;
  padding: 16px;
`

const ControlUnitName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
