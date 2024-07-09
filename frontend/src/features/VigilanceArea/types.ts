/* eslint-disable typescript-sort-keys/string-enum */
import type { GeoJSON } from 'domain/types/GeoJSON'

export namespace VigilanceArea {
  export interface VigilanceArea {
    comments: string
    createdBy: string
    endDatePeriod: string
    endingCondition: EndingCondition
    endingOccurrenceDate?: string
    endingOccurrencesNumber?: number
    frequency: Frequency
    geom: GeoJSON.MultiPolygon
    id: number
    isDraft: boolean
    linkedAMPs: Array<number>
    linkedRegulatoryAreas: Array<number>
    links: Array<Link>
    name: string
    source: string
    startDatePeriod: string
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

  export type VigilanceAreaProperties = Omit<VigilanceArea.VigilanceArea, 'geom'> & {
    layerId: number
    metadataIsShowed: boolean
  }
}
