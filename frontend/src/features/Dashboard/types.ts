import type { AMPFromAPI } from '../../domain/entities/AMPs'
import type { RegulatoryLayerCompactFromAPI } from '../../domain/entities/regulatory'
import type { Reporting } from '../../domain/entities/reporting'
import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { GeoJSON } from 'domain/types/GeoJSON'

export namespace Dashboard {
  export interface ExtractedArea {
    // TODO(24/09/2024): uniformize data naming (properties and types) from api
    amps: AMPFromAPI[]
    inseeCode: string
    regulatoryAreas: RegulatoryLayerCompactFromAPI[]
    reportings: Reporting[]
    vigilanceAreas: VigilanceArea.VigilanceArea[]
  }
  export interface ExtractedAreaFromApi {
    amps: number[]
    inseeCode: string
    regulatoryAreas: number[]
    reportings: number[]
    vigilanceAreas: number[]
  }
  export type Dashboard = {
    amps: number[]
    comments?: string
    controlUnits: number[]
    createdAt?: string
    geom?: GeoJSON.Geometry
    id: string
    inseeCode?: string
    name: string
    regulatoryAreas: number[]
    reportings: number[]
    seaFront?: string
    updatedAt?: string
    vigilanceAreas: number[]
  }

  export type DashboardToApi = {
    amps: number[]
    comments?: string
    controlUnits: number[]
    createdAt?: string
    geom?: GeoJSON.Geometry
    id?: string
    inseeCode?: string
    name: string
    regulatoryAreas: number[]
    reportings: number[]
    updatedAt?: string
    vigilanceAreas: number[]
  }

  export type DashboardFromApi = Omit<DashboardToApi, 'id, createdAt'> & { createdAt: string; id: string }

  export enum Block {
    AMP = 'AMP',
    COMMENTS = 'COMMENTS',
    CONTROL_UNITS = 'CONTROL_UNITS',
    REGULATORY_AREAS = 'REGULATORY_AREAS',
    REPORTINGS = 'REPORTINGS',
    TERRITORIAL_PRESSURE = 'TERRITORIAL_PRESSURE',
    VIGILANCE_AREAS = 'VIGILANCE_AREAS'
  }

  export enum Layer {
    DASHBOARD_AMP = 'DASHBOARD_AMP',
    DASHBOARD_REGULATORY_AREAS = 'DASHBOARD_REGULATORY_AREAS',
    DASHBOARD_REPORTINGS = 'DASHBOARD_REPORTINGS',
    DASHBOARD_VIGILANCE_AREAS = 'DASHBOARD_VIGILANCE_AREAS'
  }

  export const featuresCode = {
    [Layer.DASHBOARD_REGULATORY_AREAS]: 'DASHBOARD_REGULATORY_AREAS',
    [Layer.DASHBOARD_REPORTINGS]: 'DASHBOARD_REPORTINGS',
    [Layer.DASHBOARD_VIGILANCE_AREAS]: 'DASHBOARD_VIGILANCE_AREAS',
    [Layer.DASHBOARD_AMP]: 'DASHBOARD_AMP'
  }
}
