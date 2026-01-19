import { Icon } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import type { VesselResumePages } from '.'

type TabProps = {
  onTabChange: (tab: VesselResumePages) => void
}

export function Tabs({ onTabChange }: TabProps) {
  const [tabOpen, setTabOpen] = useState<VesselResumePages>('RESUME')

  const changeTab = (tab: VesselResumePages) => {
    setTabOpen(tab)
    onTabChange(tab)
  }

  return (
    <TabList role="tablist">
      <Tab $isActive={tabOpen === 'RESUME'} onClick={() => changeTab('RESUME')} role="tab">
        <Icon.Resume size={30} />
        Résumé
      </Tab>
      <Tab $isActive={tabOpen === 'OWNER'} $isLast onClick={() => changeTab('OWNER')} role="tab">
        <Icon.Identity size={30} />
        Propriétaire(s)
      </Tab>
    </TabList>
  )
}

const Tab = styled.button<{
  $isActive: boolean
  $isLast?: boolean
}>`
  align-items: center;
  background: ${p => (p.$isActive ? p.theme.color.blueGray : p.theme.color.charcoal)};
  ${p => (p.$isLast ? null : `border-right: 1px solid ${p.theme.color.lightGray};`)}
  color: ${p => (p.$isActive ? p.theme.color.white : p.theme.color.lightGray)};
  display: flex;
  flex-direction: column;
  font-size: 10px;
  gap: 8px;
  justify-content: center;
  padding: 12px 0 8px;

  &:hover,
  &:focus {
    color: ${p => p.theme.color.white};
    background: ${p => p.theme.color.blueYonder};
    ${p => (p.$isLast ? null : `border-right: 1px solid ${p.theme.color.lightGray};`)}
  }

  &:active {
    color: ${p => p.theme.color.white};
    background: ${p => p.theme.color.blueGray};
    ${p => (p.$isLast ? null : `border-right: 1px solid ${p.theme.color.lightGray};`)}
  }
`

const TabList = styled.div`
  border-top: 1px solid ${p => p.theme.color.lightGray};
  display: grid;
  grid-template-columns: 1fr 1fr;
`
