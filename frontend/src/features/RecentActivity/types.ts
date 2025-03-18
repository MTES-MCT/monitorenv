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
    infractionsStatus?: string[]
    startedAfter?: string
    startedBefore?: string
    themeIds?: number[]
  }

  export enum RecentActivityDateRangeEnum {
    THREE_LAST_DAYS = 'THREE_LAST_DAYS',
    THIRTY_LAST_DAYS = 'THIRTY_LAST_DAYS',
    THREE_LAST_MONTHS = 'THREE_LAST_MONTHS',
    CUSTOM = 'CUSTOM'
  }

  export enum RecentActivityDateRangeLabels {
    THREE_LAST_DAYS = '3 derniers jours',
    THIRTY_LAST_DAYS = '30 derniers jours',
    THREE_LAST_MONTHS = '3 derniers mois',
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
}
