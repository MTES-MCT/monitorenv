import { useAppSelector } from '@hooks/useAppSelector'
import { Icon } from '@mtes-mct/monitor-ui'
import React, { type ReactNode, useRef } from 'react'
import { Nav, Navbar as RsuiteNavBar } from 'rsuite'
import styled from 'styled-components'

const THRESHOLD = 6

type NavBarProps = {
  children: React.ReactNode[]
  name: string
  onSelect: (eventKey: string | number | undefined) => void
}
export function NavBar({ children, name, onSelect }: NavBarProps) {
  const currentPath = useAppSelector(state => state.sideWindow.currentPath)
  const tabs = children.slice(0, THRESHOLD)
  const dropdown = tabs.length >= THRESHOLD ? children.slice(THRESHOLD) : []

  // Swap tabs to keep same order as before
  const lastSwappedIndexes = useRef<number[]>([])
  if (lastSwappedIndexes.current[0] && lastSwappedIndexes.current[1]) {
    const tabToSwap = tabs[lastSwappedIndexes.current[0]]
    tabs.splice(lastSwappedIndexes.current[0], 1, dropdown[lastSwappedIndexes.current[1]])
    dropdown.splice(lastSwappedIndexes.current[1], 1, tabToSwap)
  }

  // Swap the last tab with the dropdown active one
  if (dropdown.length > 0) {
    const getChildProps = (child: ReactNode) => {
      if (React.isValidElement(child)) {
        return child.props
      }

      return null
    }

    const activeTabIndex = dropdown.findIndex(
      item => getChildProps(item) && getChildProps(item).eventKey === currentPath
    )

    if (activeTabIndex > -1) {
      const tabToSwap = tabs[tabs.length - 1]
      tabs.splice(tabs.length - 1, 1, dropdown[activeTabIndex])
      dropdown.splice(activeTabIndex, 1, tabToSwap)

      lastSwappedIndexes.current = [tabs.length - 1, activeTabIndex]
    }
  }

  return (
    <StyledResponsiveNav>
      <Nav activeKey={currentPath} appearance="tabs" data-cy={`${name}-nav`} onSelect={onSelect}>
        {tabs}
        {dropdown.length > 0 && (
          <StyledNavMenu icon={<Icon.More />} placement="bottomEnd">
            {dropdown}
          </StyledNavMenu>
        )}
      </Nav>
    </StyledResponsiveNav>
  )
}

const StyledResponsiveNav = styled(RsuiteNavBar)`
  > .rs-navbar-nav {
    display: flex;
    box-shadow: 0px 3px 4px #7077854d;
    height: 48px;
    width: 100%;
    background: ${p => p.theme.color.white};

    .rs-navbar-item {
      width: 360px;
      border-radius: 0px !important;
      color: ${p => p.theme.color.slateGray};
      font-size: 14px;
      border-right: 1px solid ${p => p.theme.color.lightGray};
      display: flex;
      align-items: center;
      padding: 8px 12px;
      height: inherit;
      cursor: pointer;

      &.rs-navbar-item-active {
        background-color: ${p => p.theme.color.blueGray25};
        color: ${p => p.theme.color.gunMetal};
        font-weight: 500;
        border-radius: 0px;
        border: 0px !important;
        padding: 8px 12px;

        > .rs-icon {
          color: ${p => p.theme.color.slateGray} !important;
        }
      }

      > span:not(.Element-IconBox) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }

      > .rs-icon {
        color: ${p => p.theme.color.slateGray};
      }
      &:hover {
        border-radius: 0px !important;
        background-color: ${p => p.theme.color.blueYonder25};
      }
      &:first-child {
        > svg {
          display: none;
        }
      }
    }
    .rs-dropdown {
      > .rs-dropdown-toggle {
        height: 100%;
        > .rs-icon {
          display: none;
        }
      }
      .rs-dropdown-menu {
        border-radius: 0px !important;
        .rs-dropdown-item {
          color: ${p => p.theme.color.slateGray};
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          &:hover {
            background-color: ${p => p.theme.color.blueYonder25};
          }
          &.rs-dropdown-item-active {
            background-color: ${p => p.theme.color.blueGray25};
            color: ${p => p.theme.color.gunMetal};
          }
        }
      }
    }
  }
`

const StyledNavMenu = styled(Nav.Menu)`
  .rs-navbar-item {
    width: auto !important;
    height: 100% !important;
  }
`

export const TabTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
