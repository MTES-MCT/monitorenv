import { useState } from 'react'
import styled from 'styled-components'

import { ContactDetails } from './ContactDetails'
import { InterventionAreaDetails } from './InterventionAreaDetails'
import { ResourcesDetails } from './ResourcesDetails'

import type { ControlUnit } from '@mtes-mct/monitor-ui'

type SelectedNavBar = 'CONTACTS' | 'RESOURCES' | 'INTERVENTION_AREA'

export function Details({ controlUnit }: { controlUnit: ControlUnit.ControlUnit }) {
  const [selectedNavBar, setSelectedNavBar] = useState<SelectedNavBar>('CONTACTS')

  const navigate = (navBar: SelectedNavBar) => {
    setSelectedNavBar(navBar)
  }

  return (
    <Wrapper>
      <NavBar>
        <StyledButton $isSelected={selectedNavBar === 'CONTACTS'} onClick={() => navigate('CONTACTS')} type="button">
          Contacts
        </StyledButton>
        <StyledButton $isSelected={selectedNavBar === 'RESOURCES'} onClick={() => navigate('RESOURCES')} type="button">
          Moyens
        </StyledButton>
        <StyledButton
          $isSelected={selectedNavBar === 'INTERVENTION_AREA'}
          onClick={() => navigate('INTERVENTION_AREA')}
          type="button"
        >
          Secteurs d&apos;intervention
        </StyledButton>
      </NavBar>
      {selectedNavBar === 'CONTACTS' && (
        <ContactDetails contacts={controlUnit.controlUnitContacts} termsNote={controlUnit.termsNote} />
      )}
      {selectedNavBar === 'RESOURCES' && <ResourcesDetails controlUnitResources={controlUnit.controlUnitResources} />}
      {selectedNavBar === 'INTERVENTION_AREA' && <InterventionAreaDetails notes={controlUnit.areaNote} />}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 12px;
`
const NavBar = styled.div`
  background-color: ${p => p.theme.color.slateGray};
  padding-left: 16px;
  padding-right: 16px;
`
const StyledButton = styled.button<{ $isSelected: boolean }>`
  background-color: transparent;
  color: ${p => p.theme.color.white};
  line-height: 22px;
  padding-top: 4px;
  padding-bottom: 4px;
  text-decoration: ${({ $isSelected }) => ($isSelected ? 'underline' : 'none')};
`
