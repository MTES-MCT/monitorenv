import { NavLink } from 'react-router'
import styled from 'styled-components'

import { BACK_OFFICE_MENU_LABEL, BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from './constants'

export function BackOfficeMenu() {
  return (
    <Wrapper>
      <StyledNavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.ADMINISTRATION_LIST]}
      </StyledNavLink>
      <StyledNavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.CONTROL_UNIT_LIST]}
      </StyledNavLink>
      <StyledNavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.STATION_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.STATION_LIST]}
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
  letter-spacing: 0.5px;
  line-height: 1;
  padding: 16px 24px;
  width: 200px;
`

const StyledNavLink = styled(NavLink)`
  align-items: center;
  color: ${p => p.theme.color.gainsboro};
  display: flex;
  height: 45px;
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
