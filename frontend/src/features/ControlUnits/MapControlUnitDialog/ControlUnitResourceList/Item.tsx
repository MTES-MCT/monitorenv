import { Accent, FormikTextarea, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { ControlUnit } from '../../../../domain/entities/controlUnit'
import type { Promisable } from 'type-fest'

export type ItemProps = {
  controlUnitResource: ControlUnit.ControlUnitResource
  onEdit: (controlUnitResourceId: number) => Promisable<void>
}
export function Item({ controlUnitResource, onEdit }: ItemProps) {
  return (
    <Wrapper>
      <img alt={controlUnitResource.name} src="https://placehold.co/175x140" />
      <Right>
        <RightHeader>
          <div>
            <Name>{controlUnitResource.name}</Name>
            <span>{controlUnitResource.base.name}</span>
          </div>
          <div>
            <IconButton accent={Accent.TERTIARY} Icon={Icon.Edit} onClick={() => onEdit(controlUnitResource.id)} />
          </div>
        </RightHeader>
        <div>
          <FormikTextarea isLabelHidden label="Commentaine" name="note" placeholder="Ajouter un commentaire…" />
        </div>
      </Right>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.cultured};
  display: flex;
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 8px 16px;
`

const RightHeader = styled.div`
  display: flex;
  margin-bottom: 8px;
  color: ${p => p.theme.color.gunMetal};

  > div:first-child {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
`

const Name = styled.span`
  font-weight: bold;
`
