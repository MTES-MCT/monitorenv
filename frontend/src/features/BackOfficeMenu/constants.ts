export enum BackOfficeMenuKey {
  CONTROL_UNIT_ADMINISTRATION_LIST = 'CONTROL_UNIT_ADMINISTRATION_LIST',
  CONTROL_UNIT_CONTACT_LIST = 'CONTROL_UNIT_CONTACT_LIST',
  CONTROL_UNIT_LIST = 'CONTROL_UNIT_LIST',
  CONTROL_UNIT_RESOURCE_LIST = 'CONTROL_UNIT_RESOURCE_LIST',
  PORT_LIST = 'PORT_LIST'
}

export const BACK_OFFICE_MENU_LABEL: Record<BackOfficeMenuKey, string> = {
  [BackOfficeMenuKey.CONTROL_UNIT_ADMINISTRATION_LIST]: 'Administrations',
  [BackOfficeMenuKey.CONTROL_UNIT_CONTACT_LIST]: 'Contacts',
  [BackOfficeMenuKey.CONTROL_UNIT_RESOURCE_LIST]: 'Moyens',
  [BackOfficeMenuKey.CONTROL_UNIT_LIST]: 'Unités de contrôle',
  [BackOfficeMenuKey.PORT_LIST]: 'Ports'
}

export const BACK_OFFICE_MENU_PATH: Record<BackOfficeMenuKey, string> = {
  [BackOfficeMenuKey.CONTROL_UNIT_ADMINISTRATION_LIST]: '/control_unit_administrations',
  [BackOfficeMenuKey.CONTROL_UNIT_CONTACT_LIST]: '/control_unit_contacts',
  [BackOfficeMenuKey.CONTROL_UNIT_RESOURCE_LIST]: '/control_unit_resources',
  [BackOfficeMenuKey.CONTROL_UNIT_LIST]: '/control_units',
  [BackOfficeMenuKey.PORT_LIST]: '/ports'
}
