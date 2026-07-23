import {
  isAdministrationListPage,
  isAdministrationPage,
  isControlUnitListPage,
  isControlUnitPage,
  isMissionTagListPage,
  isRegulatoryAreaGroupPage,
  isRegulatoryAreaListPage,
  isRegulatoryAreaPage,
  isStationListPage,
  isStationPage,
  isTagListPage
} from '@features/BackOffice/utils'
import { Icon } from '@mtes-mct/monitor-ui'
import { NavLink, useLocation } from 'react-router'
import styled from 'styled-components'

import { BACK_OFFICE_MENU_LABEL, BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from './constants'

export function BackOfficeMenu() {
  const locationPath = useLocation().pathname

  return (
    <Wrapper>
      <StyledNavLink
        $isActive={
          isRegulatoryAreaPage(locationPath) ||
          isRegulatoryAreaListPage(locationPath) ||
          isRegulatoryAreaGroupPage(locationPath)
        }
        to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}`}
      >
        <Icon.MapLayers />
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.REGULATORY_AREA_LIST]}
      </StyledNavLink>

      <StyledNavLink
        $isActive={isAdministrationPage(locationPath) || isAdministrationListPage(locationPath)}
        to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}`}
      >
        <Icon.GroupPerson />
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.ADMINISTRATION_LIST]}
      </StyledNavLink>
      <StyledNavLink
        $isActive={isControlUnitPage(locationPath) || isControlUnitListPage(locationPath)}
        to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}`}
      >
        <Icon.ControlUnit />
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.CONTROL_UNIT_LIST]}
      </StyledNavLink>
      <StyledNavLink
        $isActive={isStationPage(locationPath) || isStationListPage(locationPath)}
        to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.STATION_LIST]}`}
      >
        <Icon.Pinpoint />
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.STATION_LIST]}
      </StyledNavLink>
      <StyledNavLink
        $isActive={isTagListPage(locationPath)}
        to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.TAG_LIST]}`}
      >
        <Icon.Tag />
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.TAG_LIST]}
      </StyledNavLink>
      <StyledNavLink
        $isActive={isMissionTagListPage(locationPath)}
        to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.MISSION_TAG_LIST]}`}
      >
        <Icon.MissionAction />
        {BACK_OFFICE_MENU_LABEL[BackOfficeMenuKey.MISSION_TAG_LIST]}
      </StyledNavLink>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: ${p => p.theme.color.charcoal};
  border-right: solid 1px black;
  color: ${p => p.theme.color.gainsboro};
  display: flex;
  font-size: 13px;
  flex-direction: column;
  line-height: 1;
  width: 228px;
`

const StyledNavLink = styled(NavLink)<{ $isActive?: boolean }>`
  align-items: center;
  background-color: ${p => (p.$isActive ? p.theme.color.blueGray : 'none')};
  border-bottom: solid 0.5px ${p => p.theme.color.slateGray};
  color: ${p => (p.$isActive ? p.theme.color.white : p.theme.color.gainsboro)};
  display: flex;
  gap: 8px;
  height: 52px;
  padding: 16px;

  &:hover,
  &:focus {
    background-color: ${p => (p.$isActive ? p.theme.color.blueGray : 'rgba(255, 255, 255, 0.125)')};
    color: ${p => p.theme.color.white};
    text-decoration: none;
  }

  &:first-child {
    border-top: solid 0.5px ${p => p.theme.color.slateGray};
    margin-top: 64px;

    &:hover {
      border: none;
    }
  }
`
