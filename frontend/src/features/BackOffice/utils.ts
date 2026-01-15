import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from './components/BackofficeMenu/constants'

export function isRegulatoryAreaPage(pathname: string) {
  return pathname.includes(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}`)
}

export function isAdministrationPage(pathname: string) {
  return pathname.includes(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}`)
}

export function isControlUnitPage(pathname: string) {
  return pathname.includes(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}`)
}

export function isStationPage(pathname: string) {
  return pathname.includes(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.STATION_LIST]}`)
}
