import { Tab } from '@features/Vessel/components/VesselResume/Tab'
import { Icon } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import type { ResumePages } from '.'

type TabProps = {
  onTabChange: (tab: ResumePages) => void
}

export function Tabs({ onTabChange }: TabProps) {
  const [openedTab, setOpenedTab] = useState<ResumePages>('RESUME')

  const changeTab = (tab: ResumePages) => {
    setOpenedTab(tab)
    onTabChange(tab)
  }

  return (
    <TabList role="tablist">
      <Tab icon={Icon.Resume} onTabClick={page => changeTab(page)} openedTab={openedTab} page="RESUME" title="Résumé" />
      <Tab
        icon={Icon.Identity}
        onTabClick={page => changeTab(page)}
        openedTab={openedTab}
        page="OWNER"
        title="Propriétaire(s)"
      />
      <Tab
        icon={Icon.Control}
        onTabClick={page => changeTab(page)}
        openedTab={openedTab}
        page="HISTORY"
        title="Antécédents"
      />
      <StyledTab
        $isActive={openedTab === 'ADDITIONAL_INFORMATION'}
        icon={Icon.Document}
        onTabClick={page => changeTab(page)}
        openedTab={openedTab}
        page="ADDITIONAL_INFORMATION"
        title="Info(s) complément."
      />
    </TabList>
  )
}

const TabList = styled.div`
  border-top: 1px solid ${p => p.theme.color.lightGray};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  button:not(:last-child) {
    ${p => `border-right: 1px solid ${p.theme.color.lightGray};`}
  }
`

const StyledTab = styled(Tab)<{ $isActive: boolean }>`
  &:hover,
  &:focus {
    ${p => `border-right: 1px solid ${p.theme.color.lightGray};`}
    svg {
      color: ${p => p.theme.color.blueGray};
    }
  }

  &:active {
    ${p => `border-right: 1px solid ${p.theme.color.lightGray};`}
    svg {
      color: ${p => p.theme.color.blueGray};
    }
  }

  svg {
    background: ${p => (p.$isActive ? p.theme.color.white : p.theme.color.lightGray)};
    color: ${p => (p.$isActive ? p.theme.color.blueGray : p.theme.color.charcoal)};
  }
`
