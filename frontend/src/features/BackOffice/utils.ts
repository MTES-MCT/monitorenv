import { matchPath } from 'react-router'

import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from './components/BackofficeMenu/constants'

export function isRegulatoryAreaListPage(path: string) {
  const isListPage = !!matchPath(
    {
      end: true,
      path: `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}`
    },
    path
  )

  const isIndexPage = !!matchPath(
    {
      end: true,
      path: `/backoffice/`
    },
    path
  )

  return isListPage || isIndexPage
}

export function isRegulatoryAreaPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}/:id`
    },
    path
  )
}

export function isAdministrationListPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}`
    },
    path
  )
}

export function isAdministrationPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}/:id`
    },
    path
  )
}

export function isControlUnitListPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}`
    },
    path
  )
}

export function isControlUnitPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}/:id`
    },
    path
  )
}

export function isStationListPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.STATION_LIST]}`
    },
    path
  )
}

export function isStationPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.STATION_LIST]}/:id`
    },
    path
  )
}

export function isTagListPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: `/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.TAG_LIST]}`
    },
    path
  )
}
