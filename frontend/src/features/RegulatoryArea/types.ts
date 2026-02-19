import type { TagFromAPI } from 'domain/entities/tags'
import type { ThemeFromAPI } from 'domain/entities/themes'
import type { GeoJSON } from 'domain/types/GeoJSON'

export namespace RegulatoryArea {
  export type RegulatoryAreaFromAPI = {
    authorizationPeriods?: string
    creation?: string
    date?: string
    dateFin?: string
    dureeValidite?: string
    editeur?: string
    editionBo?: string
    editionCacem?: string
    facade: string
    geom: GeoJSON.MultiPolygon
    id: number
    layerName: string
    observations?: string
    othersRefReg?: OthersRegulatoryText[]
    plan: string
    polyName: string
    prohibitionPeriods?: string
    refReg: string
    resume?: string
    source?: string
    tags?: TagFromAPI[]
    temporalite?: string
    themes?: ThemeFromAPI[]
    type: string
    url: string
  }

  export type NewRegulatoryArea = RegulatoryArea.RegulatoryAreaFromAPI & {
    facade?: string
    geom?: GeoJSON.MultiPolygon
    id?: number
    layerName?: string
    plan?: string
    polyName?: string
    refReg?: string
    type?: string
    url?: string
  }

  export type RegulatoryAreaToComplete = {
    geom: GeoJSON.MultiPolygon
    id: number
    refReg: string
  }

  export type RegulatoryAreaWithBbox = RegulatoryAreaFromAPI & { bbox: number[] }

  export type OthersRegulatoryText = {
    endDate?: string
    id: string
    refReg?: string
    startDate?: string
  }
  export type RegulatoryAreasGroup = {
    group: string
    regulatoryAreas: RegulatoryAreaFromAPI[]
  }

  export enum RegulatoryAreaControlPlan {
    PIRC = 'PIRC',
    PSCEM = 'PSCEM'
  }

  export type MainRefReg = {
    date?: string
    dateFin?: string
    refReg?: string
    url?: string
  }

  export enum RegulatoryAreaType {
    AGREEMENT = 'Convention',
    BROCHURE = 'Plaquette',
    BULLETIN = 'Circulaire',
    DECISION = 'Décision',
    DECLARATION_FILE = 'Dossier de déclaration',
    DECLARATION_RECEIPT = 'Récépissé de déclaration',
    DECREE = 'Décret',
    DELIBERATION = 'Délibération',
    DIRECTIVE = 'Directive',
    DIRECTOR_ORDER = 'Arrêté du directeur',
    INTER_PREFECTORAL_ORDER = 'Arrêté inter-préfectoral',
    MARITIME_PREFECT_LETTER = 'Lettre du Préfet maritime',
    MINISTERIAL_ORDER = 'Arrêté ministériel',
    MUNICIPAL_ORDER = 'Arrêté municipal',
    MUNICIPAL_REGULATION = 'Règlement de commune',
    ORDER = 'Arrêté',
    ORDINANCE = 'Ordonnance',
    PENDING = 'En attente',
    PREFECTORAL_ORDER = 'Arrêté préfectoral',
    RECEIPT_OF_DEPOSIT = 'Récépissé de dépôt',
    REGIONAL_PREFECT_ORDER = 'Arrêté du préfet de région',
    REGULATION = 'Règlement'
  }
  export const RegulatoryAreaTypeLabel = {
    [RegulatoryAreaType.AGREEMENT]: 'Convention',
    [RegulatoryAreaType.BROCHURE]: 'Plaquette',
    [RegulatoryAreaType.BULLETIN]: 'Circulaire',
    [RegulatoryAreaType.DECISION]: 'Décision',
    [RegulatoryAreaType.DECLARATION_FILE]: 'Dossier de déclaration',
    [RegulatoryAreaType.DECLARATION_RECEIPT]: 'Récépissé de déclaration',
    [RegulatoryAreaType.DECREE]: 'Décret',
    [RegulatoryAreaType.DELIBERATION]: 'Délibération',
    [RegulatoryAreaType.DIRECTIVE]: 'Directive',
    [RegulatoryAreaType.DIRECTOR_ORDER]: 'Arrêté du directeur',
    [RegulatoryAreaType.INTER_PREFECTORAL_ORDER]: 'Arrêté inter-préfectoral',
    [RegulatoryAreaType.MARITIME_PREFECT_LETTER]: 'Lettre du Préfet maritime',
    [RegulatoryAreaType.MINISTERIAL_ORDER]: 'Arrêté ministériel',
    [RegulatoryAreaType.MUNICIPAL_ORDER]: 'Arrêté municipal',
    [RegulatoryAreaType.MUNICIPAL_REGULATION]: 'Règlement de commune',
    [RegulatoryAreaType.ORDER]: 'Arrêté',
    [RegulatoryAreaType.ORDINANCE]: 'Ordonnance',
    [RegulatoryAreaType.PENDING]: 'En attente',
    [RegulatoryAreaType.PREFECTORAL_ORDER]: 'Arrêté préfectoral',
    [RegulatoryAreaType.RECEIPT_OF_DEPOSIT]: 'Récépissé de dépôt',
    [RegulatoryAreaType.REGIONAL_PREFECT_ORDER]: 'Arrêté du préfet de région',
    [RegulatoryAreaType.REGULATION]: 'Règlement'
  } as const
}
