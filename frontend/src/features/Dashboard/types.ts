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
import type { ThemeFromAPI } from '../../domain/entities/themes'
import type { ImageApi, ImageFront, Link } from '@components/Form/types'
import type { NearbyUnit } from '@features/Dashboard/components/DashboardForm/NearbyUnits/types'
import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { ControlUnit } from '@mtes-mct/monitor-ui'
import type { ReportingTargetTypeEnum } from 'domain/entities/targetType'
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

  export type VigilanceAreaWithImages = Omit<VigilanceArea.VigilanceArea, 'images'> & {
    images: ImageFront[]
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
    nearbyUnits: NearbyUnit[]
    recentActivity: RecentActivity.RecentControlsActivity[]
    recentActivityControlUnits: ControlUnit.ControlUnit[]
    recentActivityFilters: RecentActivityFilters
    regulatoryAreas: RegulatoryLayerWithMetadata[]
    reportings: Reporting[]
    selectedControlUnits: ControlUnit.ControlUnit[]
    themes: ThemeFromAPI[]
    updatedAt?: string
    vigilanceAreas: VigilanceAreaWithImages[]
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
    NEARBY_UNITS = 'NEARBY_UNITS',
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

  // Editable Brief
  export type EditableBriefExport = {
    amps: AmpForEditableBrief[]
    dashboard: Dashboard
    image?: string
    nearbyUnits: NearbyUnit[]
    regulatoryAreas: RegulatoryAreaForEditableBrief[]
    reportings: ReportingForEditableBrief[]
    vigilanceAreas: VigilanceAreaForEditableBrief[]
  }

  export type TargetDetailsForEditableBrief = {
    externalReferenceNumber?: string
    imo?: string
    mmsi?: string
    operatorName?: string
    size?: string
    vesselName?: string
    vesselType?: string
  }

  type ReportingForEditableBrief = {
    createdAt: string | undefined
    iconColor: string
    id: number | string
    isArchived: boolean
    localization: string
    reportType: string
    reportingId: string
    reportingSources: string
    subThemes?: string
    targetDetails: TargetDetailsForEditableBrief[]
    targetType: ReportingTargetTypeEnum
    theme: string | undefined
    vehicleType: string | undefined
  }

  type VigilanceAreaForEditableBrief = {
    color: string
    comments?: string
    endDatePeriod?: string
    endingOccurenceDate: string
    frequency: string
    id: number
    image?: string
    linkedAMPs?: string
    linkedRegulatoryAreas?: string
    links?: Link[]
    minimap?: string
    name: string
    startDatePeriod?: string
    themes?: string
    visibility?: string
  }

  type AmpForEditableBrief = {
    color: string
    designation: string
    id: number
    image?: string
    minimap?: string
    name: string
    refReg?: string
    type?: string
    url?: string
  }

  type RegulatoryAreaForEditableBrief = {
    color: string
    entityName: string
    facade: string
    id: number
    image?: string
    layerName: string
    minimap?: string
    refReg: string
    themes?: string
    type: string
    url: string
  }

  export type BriefFileExport = {
    fileContent: string
    fileName: string
  }
}
