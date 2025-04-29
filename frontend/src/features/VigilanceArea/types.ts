/* eslint-disable typescript-sort-keys/string-enum */
import type { ImageApi, Link } from '@components/Form/types'
import type { TagFromAPI } from 'domain/entities/tags'
import type { ThemeFromAPI } from 'domain/entities/themes'
import type { GeoJSON } from 'domain/types/GeoJSON'

export namespace VigilanceArea {
  export interface VigilanceArea {
    comments?: string
    computedEndDate?: string
    createdAt?: string
    createdBy?: string
    endDatePeriod?: string
    endingCondition?: EndingCondition
    endingOccurrenceDate?: string
    endingOccurrencesNumber?: number
    frequency?: Frequency
    geom?: GeoJSON.MultiPolygon
    id?: number
    images?: ImageApi[]
    isArchived: boolean
    isAtAllTimes: boolean
    isDraft: boolean
    linkedAMPs?: number[]
    linkedRegulatoryAreas?: number[]
    links?: Link[]
    name: string | undefined
    seaFront: string | undefined
    source?: string
    startDatePeriod?: string
    tags?: TagFromAPI[]
    themes?: ThemeFromAPI[]
    updatedAt?: string
    visibility?: Visibility
  }

  export interface VigilanceAreaFromApi {
    comments?: string
    computedEndDate?: string
    createdAt?: string
    createdBy?: string
    endDatePeriod?: string
    endingCondition?: EndingCondition
    endingOccurrenceDate?: string
    endingOccurrencesNumber?: number
    frequency: Frequency | undefined
    geom?: GeoJSON.MultiPolygon
    id: number
    images?: ImageApi[]
    isArchived: boolean
    isAtAllTimes: boolean
    isDraft: boolean
    linkedAMPs?: number[]
    linkedRegulatoryAreas?: number[]
    links?: Link[]
    name: string
    seaFront: string | undefined
    source?: string
    startDatePeriod?: string
    tags?: TagFromAPI[]
    themes?: ThemeFromAPI[]
    updatedAt?: string
    visibility?: Visibility
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

  export type VigilanceAreaFilterPeriodType =
    | 'AT_THE_MOMENT'
    | 'NEXT_THREE_MONTHS'
    | 'CURRENT_QUARTER'
    | 'CURRENT_YEAR'
    | 'SPECIFIC_PERIOD'

  export type VigilanceAreaProperties = Omit<VigilanceArea.VigilanceArea, 'geom'> & {
    id: number
    isSelected: boolean
    layerId: number
  }

  export type VigilanceAreaLayer = VigilanceArea.VigilanceAreaFromApi & { bbox: number[] }

  export type StatusType = 'DRAFT' | 'PUBLISHED'

  export enum Status {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED'
  }

  export enum StatusLabel {
    DRAFT = 'Non publiée',
    PUBLISHED = 'Publiée'
  }
}
