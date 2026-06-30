import { type IconProps } from '@mtes-mct/monitor-ui'
import { type FunctionComponent } from 'react'
import styled from 'styled-components'

import type { ResumePages } from '.'

type TabProps = {
  className?: string
  icon: FunctionComponent<IconProps>
  onTabClick: (tab: ResumePages) => void
  openedTab: ResumePages
  page: ResumePages
  title: string
}

export function Tab({ className, icon: IconComponent, onTabClick, openedTab, page, title }: TabProps) {
  const changeTab = (tab: ResumePages) => {
    onTabClick(tab)
  }

  return (
    <StyledTab $isActive={openedTab === page} className={className} onClick={() => changeTab(page)} role="tab">
      <IconComponent size={30} />
      {title}
    </StyledTab>
  )
}

const StyledTab = styled.button<{
  $isActive: boolean
}>`
  align-items: center;
  background: ${p => (p.$isActive ? p.theme.color.blueGray : p.theme.color.charcoal)};
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
  }

  &:active {
    color: ${p => p.theme.color.white};
    background: ${p => p.theme.color.blueGray};
  }
`
