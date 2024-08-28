import { Accent, ControlUnit, Icon, IconButton, Link } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

import type { Promisable } from 'type-fest'

export type ItemProps = {
  controlUnitContact: ControlUnit.ControlUnitContactData
  onEdit: (controlUnitContactId: number) => Promisable<void>
}

export function formatPhoneNumber(phoneNumber: string) {
  if (phoneNumber.startsWith('00')) {
    if (phoneNumber.length === 12) {
      return phoneNumber.match(/.{1,2}/g)?.join(' ')
    }

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

export function Item({ controlUnitContact, onEdit }: ItemProps) {
  const handleEdit = useCallback(() => {
    onEdit(controlUnitContact.id)
  }, [controlUnitContact.id, onEdit])

  const hasLongName = !!(
    (ControlUnit.ControlUnitContactPredefinedName[controlUnitContact.name]?.length ||
      controlUnitContact.name?.length) >= 30
  )

  return (
    <Wrapper data-cy="ControlUnitDialog-control-unit-contact" data-id={controlUnitContact.id}>
      <Left>
        <NameAndContactContainer $isColumn={hasLongName}>
          <Name
            title={ControlUnit.ControlUnitContactPredefinedName[controlUnitContact.name] || controlUnitContact.name}
          >
            {ControlUnit.ControlUnitContactPredefinedName[controlUnitContact.name] || controlUnitContact.name}
          </Name>
          {controlUnitContact.phone && (
            <Phone $withLongName={!hasLongName}>{formatPhoneNumber(controlUnitContact.phone)}</Phone>
          )}
          {controlUnitContact.isSmsSubscriptionContact && (
            <Icon.Subscription size={14} title="Numéro de diffusion pour les préavis et les rapports de contrôle" />
          )}
        </NameAndContactContainer>
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
  padding: 8px 8px 12px 16px;
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
  padding: 3px;
`
const NameAndContactContainer = styled.p<{ $isColumn: boolean }>`
  display: flex !important;
  flex-direction: ${p => (p.$isColumn ? 'column' : 'row')};
  align-items: start !important;
`

const Name = styled.span`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;
`

const Phone = styled.span<{ $withLongName: boolean }>`
  ${p => (p.$withLongName ? 'margin-left: 16px;' : 'margin-top: 8px;')}
`
