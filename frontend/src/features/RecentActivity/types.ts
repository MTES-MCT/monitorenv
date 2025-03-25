/* eslint-disable typescript-sort-keys/string-enum */
import type { Infraction } from 'domain/entities/missions'
import type { TargetTypeEnum } from 'domain/entities/targetType'
import type { VehicleTypeEnum } from 'domain/entities/vehicleType'
import type { GeoJSON } from 'domain/types/GeoJSON'

export namespace RecentActivity {
  export interface RecentControlsActivity {
    actionNumberOfControls: number
    actionStartDateTimeUtc: string
    actionTargetType: TargetTypeEnum
    administrationIds: number[]
    controlUnitIds: number[]
    department: string
    facade: string
    geom: GeoJSON.MultiPolygon
    id: string
    infractions: Infraction[]
    missionId: number
    observations: string
    subThemeIds: number[]
    themeIds: number[]
    vehicleType: VehicleTypeEnum
  }

  export interface Filters {
    administrationIds?: number[]
    controlUnitIds?: number[]
    geometry?: GeoJSON.MultiPolygon
    startedAfter?: string
    startedBefore?: string
    themeIds?: number[]
  }

  export enum RecentActivityDateRangeEnum {
    SEVEN_LAST_DAYS = 'SEVEN_LAST_DAYS',
    THIRTY_LAST_DAYS = 'THIRTY_LAST_DAYS',
    THREE_LAST_MONTHS = 'THREE_LAST_MONTHS',
    CURRENT_YEAR = 'CURRENT_YEAR',
    CUSTOM = 'CUSTOM'
  }

  export enum RecentActivityDateRangeLabels {
    SEVEN_LAST_DAYS = '7 derniers jours',
    THIRTY_LAST_DAYS = '30 derniers jours',
    THREE_LAST_MONTHS = '3 derniers mois',
    CURRENT_YEAR = 'Année en cours',
    CUSTOM = 'Période spécifique'
  }

  export enum DistinctionFilterEnum {
    WITH_DISTINCTION = 'WITH_DISTINCTION',
    WITHOUT_DISTINCTION = 'WITHOUT_DISTINCTION'
  }

  export enum DistinctionFilterLabels {
    WITH_DISTINCTION = 'Distinction avec ou sans infraction',
    WITHOUT_DISTINCTION = 'Sans distinction'
  }

  export const CONTROLS_COLORS = ['#87C20D', '#FAC200', '#E79000', '#CE6000', '#AF2E12', '#810030', '#480135']

  export const CONTROL_THRESHOLDS = [
    { color: CONTROLS_COLORS[0], limit: 6 },
    { color: CONTROLS_COLORS[1], limit: 11 },
    { color: CONTROLS_COLORS[2], limit: 26 },
    { color: CONTROLS_COLORS[3], limit: 51 },
    { color: CONTROLS_COLORS[4], limit: 76 },
    { color: CONTROLS_COLORS[5], limit: 91 },
    { color: CONTROLS_COLORS[6], limit: 101 }
  ]
}
