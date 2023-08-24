import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { ControlUnit } from '../../../../domain/entities/ControlUnit/types'
import type { Promisable } from 'type-fest'

export type ItemProps = {
  controlUnitContact: ControlUnit.ControlUnitContactData
  onEdit: (controlUnitContactId: number) => Promisable<void>
}
export function Item({ controlUnitContact, onEdit }: ItemProps) {
  return (
    <Wrapper>
      <Left>
        <p>
          <Name>{controlUnitContact.name}</Name> {controlUnitContact.phone}
        </p>
        <p>
          <a href={`mailto:${controlUnitContact.email}`} rel="noreferrer" target="_blank">
            {controlUnitContact.email}
          </a>
        </p>
      </Left>
      <Right>
        <IconButton accent={Accent.TERTIARY} Icon={Icon.Edit} onClick={() => onEdit(controlUnitContact.id)} />
      </Right>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.cultured};
  color: ${p => p.theme.color.slateGray};
  display: flex;
  margin-top: 8px;
  padding: 8px 16px;

  > p:not(:first-child) {
    margin: 8px 0 0;
  }
`

const Left = styled.div`
  flex-grow: 1;
`

const Right = styled.div``

const Name = styled.span`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;
`
