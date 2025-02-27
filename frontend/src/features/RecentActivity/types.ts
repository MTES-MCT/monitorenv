import type { Infraction } from 'domain/entities/missions'
import type { TargetTypeEnum } from 'domain/entities/targetType'
import type { VehicleTypeEnum } from 'domain/entities/vehicleType'
import type { Geometry } from 'ol/geom'

export namespace RecentActivity {
  export interface RecentControlsActivity {
    actionNumberOfControls: number
    actionStartDateTimeUtc: string
    actionTargetType: TargetTypeEnum
    administrationIds: number[]
    controlUnitIds: number[]
    department: string
    facade: string
    geom: Geometry
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
    geometry?: string
    infractionsStatus?: string[]
    startedAfter?: string
    startedBefore?: string
    themeIds?: number[]
  }
}
