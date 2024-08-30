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
      controlUnitContact.name?.length) >= 33
  )

  return (
    <Wrapper data-cy="ControlUnitDialog-control-unit-contact" data-id={controlUnitContact.id}>
      <Left $hasLongName={hasLongName}>
        <NameAndContactContainer $hasLongName={hasLongName}>
          <Name
            title={ControlUnit.ControlUnitContactPredefinedName[controlUnitContact.name] || controlUnitContact.name}
          >
            {ControlUnit.ControlUnitContactPredefinedName[controlUnitContact.name] || controlUnitContact.name}
          </Name>
          {controlUnitContact.phone && <span>{formatPhoneNumber(controlUnitContact.phone)}</span>}
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
  gap: 16px;
  padding: 8px 8px 12px 12px;

  > p:not(:first-child) {
    margin: 8px 0 0;
  }
`

const Left = styled.div<{ $hasLongName: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  > p {
    align-items: center;
    display: flex;
    line-height: 18px;
    gap: ${p => (p.$hasLongName ? '8px' : '16px')};
  }
`

const Right = styled.div`
  > .Element-IconButton {
    padding: 0px;
  }
`
const NameAndContactContainer = styled.p<{ $hasLongName: boolean }>`
  display: flex !important;
  flex-direction: ${p => (p.$hasLongName ? 'column' : 'row')};
  align-items: start !important;
`

const Name = styled.span`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;
  overflow-wrap: anywhere;
`
