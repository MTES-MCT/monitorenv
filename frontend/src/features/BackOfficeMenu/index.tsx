import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { BACK_OFFICE_MENU_LABEL, BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from './constants'

export function BackOfficeMenu() {
  return (
    <Wrapper>
      <NavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.ADMINISTRATION_LIST]}
      </NavLink>
      <NavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_CONTACT_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.CONTROL_UNIT_CONTACT_LIST]}
      </NavLink>
      <NavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_RESOURCE_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.CONTROL_UNIT_RESOURCE_LIST]}
      </NavLink>
      <NavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.CONTROL_UNIT_LIST]}
      </NavLink>
      <NavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.BASE_LIST]}
      </NavLink>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border-right: solid 1px black;
  display: flex;
  flex-direction: column;
  padding: 16px;
`
