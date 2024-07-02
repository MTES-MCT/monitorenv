import { Accent, ControlUnit, Icon, IconButton, Link } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

import type { Promisable } from 'type-fest'

export type ItemProps = {
  controlUnitContact: ControlUnit.ControlUnitContactData
  onEdit: (controlUnitContactId: number) => Promisable<void>
}
export function Item({ controlUnitContact, onEdit }: ItemProps) {
  const handleEdit = useCallback(() => {
    onEdit(controlUnitContact.id)
  }, [controlUnitContact.id, onEdit])

  function formatPhoneNumber(phoneNumber: string) {
    if (phoneNumber.startsWith('00')) {
      return `00 ${phoneNumber
        .slice(2)
        .match(/.{1,3}/g)
        ?.join(' ')}`
    }
    if (phoneNumber.startsWith('0')) {
      return phoneNumber.match(/.{1,2}/g)?.join(' ')
    }

    return phoneNumber.match(/.{1,3}/g)?.join(' ')
  }

  return (
    <Wrapper data-cy="ControlUnitDialog-control-unit-contact" data-id={controlUnitContact.id}>
      <Left>
        <p>
          <Name>
            {ControlUnit.ControlUnitContactPredefinedName[controlUnitContact.name] || controlUnitContact.name}
          </Name>
          {controlUnitContact.phone && <Phone>{formatPhoneNumber(controlUnitContact.phone)}</Phone>}
          {controlUnitContact.isSmsSubscriptionContact && (
            <Icon.Subscription size={14} title="Numéro de diffusion pour les préavis et les rapports de contrôle" />
          )}
        </p>
        <p>
          <Link href={`mailto:${controlUnitContact.email}`} rel="noreferrer" target="_blank">
            {controlUnitContact.email}
          </Link>
          {controlUnitContact.isEmailSubscriptionContact && (
            <Icon.Subscription size={14} title="Adresse de diffusion pour les préavis et les rapports de contrôle" />
          )}
        </p>
      </Left>
      <Right>
        <IconButton accent={Accent.TERTIARY} Icon={Icon.Edit} onClick={handleEdit} title="Éditer ce contact" />
      </Right>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.cultured};
  color: ${p => p.theme.color.slateGray};
  display: flex;
  margin-top: 8px;

  > p:not(:first-child) {
    margin: 8px 0 0;
  }
`

const Left = styled.div`
  flex-grow: 1;
  padding: 8px 16px 12px;

  > p {
    align-items: center;
    display: flex;
    line-height: 18px;

    > .Element-IconBox {
      margin-left: 8px;
      margin-bottom: -1px;
    }
  }
`

const Right = styled.div`
  padding: 0 1px;
`

const Name = styled.span`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;
`

const Phone = styled.span`
  margin-left: 16px;
`
