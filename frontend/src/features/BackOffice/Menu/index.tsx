import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { BACK_OFFICE_MENU_LABEL, BACK_OFFICE_MENU_PATH, BackOfficeMenu } from './constants'

export function Menu() {
  return (
    <Wrapper>
      <NavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_ADMINISTRATION_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenu.CONTROL_UNIT_ADMINISTRATION_LIST]}
      </NavLink>
      <NavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_CONTACT_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenu.CONTROL_UNIT_CONTACT_LIST]}
      </NavLink>
      <NavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_RESOURCE_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenu.CONTROL_UNIT_RESOURCE_LIST]}
      </NavLink>
      <NavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenu.CONTROL_UNIT_LIST]}
      </NavLink>
      <NavLink to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenu.PORT_LIST]}`}>
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenu.PORT_LIST]}
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
