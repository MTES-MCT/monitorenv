import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import ResponsiveNav from '@rsuite/responsive-nav'
import styled from 'styled-components'

export function NavBar({ children, onClose, onSelect }) {
  const currentPath = useAppSelector(state => state.sideWindow.currentPath)

  return (
    <StyledResponsiveNav
      activeKey={currentPath}
      appearance="tabs"
      data-cy="dashboards-nav"
      moreProps={{ placement: 'bottomEnd' }}
      moreText={<IconButton accent={Accent.TERTIARY} Icon={Icon.More} />}
      onItemRemove={onClose}
      onSelect={onSelect}
      removable
    >
      {children}
    </StyledResponsiveNav>
  )
}

const StyledResponsiveNav = styled(ResponsiveNav)`
  display: flex;
  box-shadow: 0px 3px 4px #7077854d;
  height: 48px;
  width: 100%;

  > .rs-nav-item {
    width: 360px;
    border-radius: 0px !important;
    color: ${p => p.theme.color.slateGray};
    font-size: 14px;
    border-right: 1px solid ${p => p.theme.color.lightGray};
    display: flex;
    align-items: center;

    &.rs-nav-item-active {
      background-color: ${p => p.theme.color.blueGray25};
      color: ${p => p.theme.color.gunMetal};
      font-weight: 500;
      border-radius: 0px;
      border: 0px !important;

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
  > .rs-dropdown {
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
  > .rs-nav-bar {
    border-top: 0px;
  }
`
