import ResponsiveNav from '@rsuite/responsive-nav'
import styled from 'styled-components'

export const Wrapper = styled.section`
  background: ${p => p.theme.color.white};
  display: flex;

  height: 100%;
  min-height: 0;
  min-width: 0;

  @keyframes blink {
    0% {
      background: ${p => p.theme.color.white};
    }
    50% {
      background: ${p => p.theme.color.lightGray};
    }
    0% {
      background: ${p => p.theme.color.white};
    }
  }
`

export const StyledContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: calc(100vw - 64px);
`
export const StyledResponsiveNav = styled(ResponsiveNav)`
  display: flex;
  height: 48px;
  box-shadow: 0px 3px 4px #7077854d;
  > .rs-nav-item {
    width: 360px;
    height: 48px;
    border-radius: 0px !important;
    color: ${p => p.theme.color.slateGray};
    font-size: 14px;
    border-right: 1px solid ${p => p.theme.color.lightGray};
    display: flex;
    align-items: center;

    &.rs-nav-item-active {
      background-color: ${p => p.theme.color.blueGray[25]};
      color: ${p => p.theme.color.gunMetal};
      font-weight: 500;
      border-radius: 0px;
      border: 0px !important;
      > .rs-icon {
        color: ${p => p.theme.color.slateGray} !important;
      }
    }
    > span {
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
        &:hover {
          background-color: #e5e5ea;
        }
        &.rs-dropdown-item-active {
          background-color: ${p => p.theme.color.blueGray[25]};
          color: ${p => p.theme.color.gunMetal};
        }
      }
    }
  }
  > .rs-nav-bar {
    border-top: 0px;
  }
`

export const StyledStatus = styled.div<{ color: string }>`
  height: 8px;
  width: 8px;
  margin-right: 5px;
  background-color: ${p => p.color};
  border-radius: 50%;
  display: inline-block;
`
