import { RecentActivity } from '@features/RecentActivity/types'
import { BaseLayer } from 'domain/entities/layers/BaseLayer'

import type { RecentActivityFilters } from './components/DashboardForm/slice'
import type { ExportImageType } from './hooks/useExportImages'
import type { AMP, AMPFromAPI } from '../../domain/entities/AMPs'
import type {
  RegulatoryLayerCompact,
  RegulatoryLayerCompactFromAPI,
  RegulatoryLayerWithMetadata
} from '../../domain/entities/regulatory'
import type { Reporting } from '../../domain/entities/reporting'
import type { ImageApi, ImageFront, Link } from '@components/Form/types'
import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { ControlUnit } from '@mtes-mct/monitor-ui'
import type { ControlPlansSubThemeCollection, ControlPlansThemeCollection } from 'domain/entities/controlPlan'
import type { GeoJSON } from 'domain/types/GeoJSON'

export namespace Dashboard {
  export interface ExtractedArea {
    // TODO(24/09/2024): uniformize data naming (properties and types) from api
    amps: AMPFromAPI[]
    inseeCode: string
    regulatoryAreas: RegulatoryLayerCompactFromAPI[]
    reportings: Reporting[]
    vigilanceAreas: VigilanceArea.VigilanceAreaFromApi[] | VigilanceArea.VigilanceAreaLayer[]
  }
  export interface ExtractedAreaFromApi {
    ampIds: number[]
    inseeCode: string
    regulatoryAreaIds: number[]
    reportingIds: number[]
    vigilanceAreaIds: number[]
  }
  export type Dashboard = {
    ampIds: number[]
    comments?: string
    controlUnitIds: number[]
    createdAt?: string
    geom?: GeoJSON.Geometry
    id: string
    images: ImageApi[]
    inseeCode?: string
    links: Link[]
    name: string
    regulatoryAreaIds: number[]
    reportingIds: number[]
    seaFront?: string
    updatedAt?: string
    vigilanceAreaIds: number[]
  }

  export type Brief = {
    allLinkedAMPs: AMPFromAPI[]
    allLinkedRegulatoryAreas: RegulatoryLayerWithMetadata[]
    amps: AMPFromAPI[]
    attachments: {
      images?: ImageFront[]
      links: Link[]
    }
    comments?: string
    images: ExportImageType[] | undefined
    name: string
    recentActivity: RecentActivity.RecentControlsActivity[]
    recentActivityControlUnits: ControlUnit.ControlUnit[]
    recentActivityFilters: RecentActivityFilters
    regulatoryAreas: RegulatoryLayerWithMetadata[]
    reportings: Reporting[]
    selectedControlUnits: ControlUnit.ControlUnit[]
    subThemes: ControlPlansSubThemeCollection
    themes: ControlPlansThemeCollection
    updatedAt?: string
    vigilanceAreas: VigilanceArea.VigilanceArea[]
  }

  export type DashboardToApi = {
    ampIds: number[]
    comments?: string
    controlUnitIds: number[]
    createdAt?: string
    geom?: GeoJSON.Geometry
    id?: string
    images: ImageApi[]
    inseeCode?: string
    links: Link[]
    name: string
    regulatoryAreaIds: number[]
    reportingIds: number[]
    seaFront?: string
    updatedAt?: string
    vigilanceAreaIds: number[]
  }

  export type DashboardFromApi = Omit<DashboardToApi, 'id' | 'createdAt' | 'geom'> & {
    createdAt: string
    geom: GeoJSON.Geometry
    id: string
  }

  export type PopulatedDashboard = Omit<
    DashboardFromApi,
    'reportings' | 'amps' | 'vigilanceAreas' | 'regulatoryAreas'
  > & {
    amps: AMP[]
    regulatoryAreas: RegulatoryLayerCompact[]
    reportings: Reporting[]
    vigilanceAreas: VigilanceArea.VigilanceAreaLayer[]
  }

  export enum Block {
    AMP = 'AMP',
    ATTACHMENTS = 'ATTACHMENTS',
    BACKGROUND_MAP = 'BACKGROUND_MAP',
    COMMENTS = 'COMMENTS',
    CONTROL_UNITS = 'CONTROL_UNITS',
    RECENT_ACTIVITY = 'RECENT_ACTIVITY',
    REGULATORY_AREAS = 'REGULATORY_AREAS',
    REPORTINGS = 'REPORTINGS',
    TERRITORIAL_PRESSURE = 'TERRITORIAL_PRESSURE',
    VIGILANCE_AREAS = 'VIGILANCE_AREAS',
    WEATHER = 'WEATHER'
  }

  export enum Layer {
    DASHBOARD_ALL_RECENT_ACTIVITY = 'DASHBOARD_ALL_RECENT_ACTIVITY',
    DASHBOARD_AMP = 'DASHBOARD_AMP',
    DASHBOARD_RECENT_ACTIVITY_BY_UNIT = 'DASHBOARD_RECENT_ACTIVITY_BY_UNIT',
    DASHBOARD_REGULATORY_AREAS = 'DASHBOARD_REGULATORY_AREAS',
    DASHBOARD_REPORTINGS = 'DASHBOARD_REPORTINGS',
    DASHBOARD_VIGILANCE_AREAS = 'DASHBOARD_VIGILANCE_AREAS'
  }

  export const featuresCode = {
    [Layer.DASHBOARD_REGULATORY_AREAS]: 'DASHBOARD_REGULATORY_AREAS',
    [Layer.DASHBOARD_REPORTINGS]: 'DASHBOARD_REPORTINGS',
    [Layer.DASHBOARD_VIGILANCE_AREAS]: 'DASHBOARD_VIGILANCE_AREAS',
    [Layer.DASHBOARD_AMP]: 'DASHBOARD_AMP',
    [Layer.DASHBOARD_ALL_RECENT_ACTIVITY]: 'DASHBOARD_ALL_RECENT_ACTIVITY',
    [Layer.DASHBOARD_RECENT_ACTIVITY_BY_UNIT]: 'DASHBOARD_RECENT_ACTIVITY_BY_UNIT'
  }

  export const BackgroundMapLabel: Record<BaseLayer, string> = {
    [BaseLayer.LIGHT]: 'Fond de carte clair',
    [BaseLayer.OSM]: 'Open Street Map (défaut)',
    [BaseLayer.SATELLITE]: 'Satellite',
    [BaseLayer.SHOM]: 'Carte marine (SHOM)'
  }
}
