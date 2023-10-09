import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

import { ControlUnit } from '../../../../../domain/entities/controlUnit'

import type { Promisable } from 'type-fest'

export type ItemProps = {
  controlUnitResource: ControlUnit.ControlUnitResource
  onEdit: (controlUnitResourceId: number) => Promisable<void>
}
export function Item({ controlUnitResource, onEdit }: ItemProps) {
  const handleEdit = useCallback(() => {
    onEdit(controlUnitResource.id)
  }, [controlUnitResource.id, onEdit])

  return (
    <Wrapper>
      <Placeholder />
      <InfoBox>
        <InfoBoxHeader>
          <div>
            <Name>
              {ControlUnit.ControlUnitResourceType[controlUnitResource.type]} – {controlUnitResource.name}
            </Name>
            <p>{controlUnitResource.base.name}</p>
          </div>
          <div>
            <IconButton accent={Accent.TERTIARY} Icon={Icon.Edit} onClick={handleEdit} title="Éditer ce moyen" />
          </div>
        </InfoBoxHeader>
        <p>{controlUnitResource.note}</p>
      </InfoBox>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.cultured};
  display: flex;
`

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 8px 16px;
`

const InfoBoxHeader = styled.div`
  display: flex;
  margin-bottom: 8px;
  color: ${p => p.theme.color.gunMetal};

  > div:first-child {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
`

const Placeholder = styled.div`
  background-color: ${p => p.theme.color.lightGray};
  height: 94px;
  min-height: 94px;
  min-width: 116px;
  width: 116px;
`

const Name = styled.p`
  font-weight: bold;
`
