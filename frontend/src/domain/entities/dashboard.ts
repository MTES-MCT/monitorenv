import type { AMPFromAPI } from './AMPs'
import type { RegulatoryLayerCompactFromAPI } from './regulatory'
import type { Reporting } from './reporting'
import type { VigilanceArea } from '@features/VigilanceArea/types'

export namespace Dashboard {
  export interface ExtractedArea {
    // TODO(): uniformize data naming (properties and types) from api
    amps: AMPFromAPI[]
    inseeCode: string
    regulatoryAreas: RegulatoryLayerCompactFromAPI[]
    reportings: Reporting[]
    vigilanceAreas: VigilanceArea.VigilanceArea[]
  }
}
