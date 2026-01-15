export enum BackOfficeMenuKey {
  ADMINISTRATION_LIST = 'ADMINISTRATION_LIST',
  CONTROL_UNIT_CONTACT_LIST = 'CONTROL_UNIT_CONTACT_LIST',
  CONTROL_UNIT_LIST = 'CONTROL_UNIT_LIST',
  CONTROL_UNIT_RESOURCE_LIST = 'CONTROL_UNIT_RESOURCE_LIST',
  REGULATORY_AREA_LIST = 'REGULATORY_AREA_LIST',
  STATION_LIST = 'STATION_LIST'
}

export const BACK_OFFICE_MENU_LABEL: Record<BackOfficeMenuKey, string> = {
  [BackOfficeMenuKey.REGULATORY_AREA_LIST]: 'Zones réglementaires',
  [BackOfficeMenuKey.ADMINISTRATION_LIST]: 'Administrations',
  [BackOfficeMenuKey.CONTROL_UNIT_CONTACT_LIST]: 'Contacts',
  [BackOfficeMenuKey.CONTROL_UNIT_RESOURCE_LIST]: 'Moyens',
  [BackOfficeMenuKey.CONTROL_UNIT_LIST]: 'Unités de contrôle',
  [BackOfficeMenuKey.STATION_LIST]: 'Bases'
}

export const BACK_OFFICE_MENU_PATH: Record<BackOfficeMenuKey, string> = {
  [BackOfficeMenuKey.REGULATORY_AREA_LIST]: '/regulatory_areas',
  [BackOfficeMenuKey.ADMINISTRATION_LIST]: '/administrations',
  [BackOfficeMenuKey.CONTROL_UNIT_CONTACT_LIST]: '/control_unit_contacts',
  [BackOfficeMenuKey.CONTROL_UNIT_RESOURCE_LIST]: '/control_unit_resources',
  [BackOfficeMenuKey.CONTROL_UNIT_LIST]: '/control_units',
  [BackOfficeMenuKey.STATION_LIST]: '/stations'
}
