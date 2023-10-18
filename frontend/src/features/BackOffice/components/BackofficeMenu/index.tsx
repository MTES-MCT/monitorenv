import { Icon } from '@mtes-mct/monitor-ui'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { BACK_OFFICE_MENU_LABEL, BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from './constants'

export function BackOfficeMenu() {
  return (
    <Wrapper>
      <StyledNavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}`}>
        <Icon.Car />
        <NavText>{BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.ADMINISTRATION_LIST]}</NavText>
      </StyledNavLink>
      <StyledNavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}`}>
        <Icon.ControlUnit />
        <NavText>{BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.CONTROL_UNIT_LIST]}</NavText>
      </StyledNavLink>
      <StyledNavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]}`}>
        <Icon.Car />
        <NavText>{BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.BASE_LIST]}</NavText>
      </StyledNavLink>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: ${p => p.theme.color.charcoal};
  border-right: solid 1px black;
  color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-direction: column;
  padding: 15px;
  width: 240px;
`

const StyledNavLink = styled(NavLink)`
  align-items: center;
  color: ${p => p.theme.color.gainsboro};
  display: flex;
  height: 45px;
  padding: 0 5px;
  text-align: left;

  && {
    color: ${p => p.theme.color.gainsboro};
  }
  &:after {
    color: ${p => p.theme.color.gainsboro};
  }
  &:before {
    color: ${p => p.theme.color.gainsboro};
  }
`

const NavText = styled.span`
  line-height: 9px;
  margin: 0 0 0 8px;
  letter-spacing: 0.5px;
`
