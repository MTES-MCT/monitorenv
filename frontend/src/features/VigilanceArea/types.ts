/* eslint-disable typescript-sort-keys/string-enum */
import type { GeoJSON } from 'domain/types/GeoJSON'

export namespace VigilanceArea {
  export interface VigilanceArea {
    comments: string | undefined
    computedEndDate?: string
    createdBy: string | undefined
    endDatePeriod: string | undefined
    endingCondition: EndingCondition | undefined
    endingOccurrenceDate?: string | undefined
    endingOccurrencesNumber?: number | undefined
    frequency: Frequency | undefined
    geom: GeoJSON.MultiPolygon | undefined
    id: number
    isArchived: boolean
    isDraft: boolean
    linkedAMPs: Array<number>
    linkedRegulatoryAreas: Array<number>
    links: Array<Link>
    name: string
    source: string | undefined
    startDatePeriod: string | undefined
    themes: Array<string>
    visibility: Visibility
  }

  export interface Link {
    linkText?: string
    linkUrl?: string
  }
  export enum Frequency {
    NONE = 'NONE',
    ALL_WEEKS = 'ALL_WEEKS',
    ALL_MONTHS = 'ALL_MONTHS',
    ALL_YEARS = 'ALL_YEARS'
  }

  export enum FrequencyLabel {
    NONE = 'Aucune',
    ALL_WEEKS = 'Toutes les semaines',
    ALL_MONTHS = 'Tous les mois',
    ALL_YEARS = 'Tous les ans'
  }

  export enum EndingCondition {
    NEVER = 'NEVER',
    END_DATE = 'END_DATE',
    OCCURENCES_NUMBER = 'OCCURENCES_NUMBER'
  }

  export enum EndingConditionLabel {
    NEVER = 'Jamais',
    END_DATE = 'Le…',
    OCCURENCES_NUMBER = 'Après… x fois'
  }

  export enum Visibility {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
  }

  export enum VisibilityLabel {
    PUBLIC = 'Publique',
    PRIVATE = 'Interne CACEM'
  }

  export enum VigilanceAreaFilterPeriod {
    AT_THE_MOMENT = 'AT_THE_MOMENT',
    NEXT_THREE_MONTHS = 'NEXT_THREE_MONTHS',
    CURRENT_QUARTER = 'CURRENT_QUARTER',
    CURRENT_YEAR = 'CURRENT_YEAR',
    SPECIFIC_PERIOD = 'SPECIFIC_PERIOD'
  }

  export enum VigilanceAreaFilterPeriodLabel {
    AT_THE_MOMENT = 'En ce moment',
    NEXT_THREE_MONTHS = 'Les trois prochains mois',
    CURRENT_QUARTER = 'Ce trimestre',
    CURRENT_YEAR = 'Cette année',
    SPECIFIC_PERIOD = 'Période spécifique'
  }

  export type VigilanceAreaProperties = Omit<VigilanceArea.VigilanceArea, 'geom'> & {
    id: number
    isSelected: boolean
    layerId: number
  }

  export type VigilanceAreaLayer = VigilanceArea.VigilanceArea & { bbox: number[] }
}
