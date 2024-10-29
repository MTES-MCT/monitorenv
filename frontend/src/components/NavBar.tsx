import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { Nav, Navbar as RsuiteNavBar } from 'rsuite'
import styled from 'styled-components'

type NavBarProps = {
  children: React.ReactNode
  name: string
  onSelect: (eventKey: string | number | undefined) => void
}
export function NavBar({ children, name, onSelect }: NavBarProps) {
  const currentPath = useAppSelector(state => state.sideWindow.currentPath)

  return (
    <StyledResponsiveNav
      data-cy={`${name}-nav`}
      moreProps={{ placement: 'bottomEnd' }}
      moreText={<IconButton accent={Accent.TERTIARY} Icon={Icon.More} />}
    >
      <Nav activeKey={currentPath} appearance="tabs" onSelect={onSelect}>
        {children}
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
        border-radius: 0px !important;
        > .rs-icon {
          display: none;
        }
      }
      > .rs-dropdown-menu {
        > .rs-dropdown-item {
          color: ${p => p.theme.color.slateGray};
          display: flex;
          flex-direction: row;
          align-items: center;
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

  > .rs-nav-bar {
    border-top: 0px;
  }
`
