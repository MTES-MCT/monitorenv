export enum BackOfficeMenu {
  CONTROL_UNIT_ADMINISTRATION_LIST = 'CONTROL_UNIT_ADMINISTRATION_LIST',
  CONTROL_UNIT_CONTACT_LIST = 'CONTROL_UNIT_CONTACT_LIST',
  CONTROL_UNIT_LIST = 'CONTROL_UNIT_LIST',
  CONTROL_UNIT_RESOURCE_LIST = 'CONTROL_UNIT_RESOURCE_LIST',
  PORT_LIST = 'PORT_LIST'
}

export const BACK_OFFICE_MENU_LABEL: Record<BackOfficeMenu, string> = {
  [BackOfficeMenu.CONTROL_UNIT_ADMINISTRATION_LIST]: 'Administrations',
  [BackOfficeMenu.CONTROL_UNIT_CONTACT_LIST]: 'Contacts',
  [BackOfficeMenu.CONTROL_UNIT_RESOURCE_LIST]: 'Moyens',
  [BackOfficeMenu.CONTROL_UNIT_LIST]: 'Unités de contrôle',
  [BackOfficeMenu.PORT_LIST]: 'Ports'
}

export const BACK_OFFICE_MENU_PATH: Record<BackOfficeMenu, string> = {
  [BackOfficeMenu.CONTROL_UNIT_ADMINISTRATION_LIST]: '/control_unit_administrations',
  [BackOfficeMenu.CONTROL_UNIT_CONTACT_LIST]: '/control_unit_contacts',
  [BackOfficeMenu.CONTROL_UNIT_RESOURCE_LIST]: '/control_unit_resources',
  [BackOfficeMenu.CONTROL_UNIT_LIST]: '/control_units',
  [BackOfficeMenu.PORT_LIST]: '/ports'
}
