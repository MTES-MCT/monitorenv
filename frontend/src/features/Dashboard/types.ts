import type { AMPFromAPI } from '../../domain/entities/AMPs'
import type { RegulatoryLayerCompactFromAPI } from '../../domain/entities/regulatory'
import type { Reporting } from '../../domain/entities/reporting'
import type { VigilanceArea } from '@features/VigilanceArea/types'

export namespace Dashboard {
  export interface ExtractedArea {
    // TODO(24/09/2024): uniformize data naming (properties and types) from api
    amps: AMPFromAPI[]
    inseeCode: string
    regulatoryAreas: RegulatoryLayerCompactFromAPI[]
    reportings: Reporting[]
    vigilanceAreas: VigilanceArea.VigilanceArea[]
  }
  export enum Block {
    AMP = 'AMP',
    COMMENTS = 'COMMENTS',
    CONTROL_UNITS = 'CONTROL_UNITS',
    REGULATORY_AREAS = 'REGULATORY_AREAS',
    REPORTINGS = 'REPORTINGS',
    TERRITORIAL_PRESSURE = 'TERRITORIAL_PRESSURE',
    VIGILANCE_AREAS = 'VIGILANCE_AREAS'
  }
}