/* eslint-disable typescript-sort-keys/string-enum */
import type { GeoJSON } from '../../domain/types/GeoJSON'

export namespace Vessel {
  export interface Identity {
    category?: string
    flag?: string
    id: number
    immatriculation?: string
    imo?: string
    mmsi?: string
    shipId?: number
    shipName?: string
  }

  export interface Vessel extends Identity {
    commercialName?: string
    leisureType?: string
    length?: number
    ownerBusinessSegmentLabel?: string
    ownerCompanyName?: string
    ownerDateOfBirth?: string
    ownerEmail?: string
    ownerFirstName?: string
    ownerLastName?: string
    ownerLegalStatusLabel?: string
    ownerNationality?: string
    ownerPhone?: string
    ownerPostalAddress?: string
    ownerStartDate?: string
    portOfRegistry?: string
    positions?: Position[]
    professionalType?: string
    shipName?: string
    status?: string
  }

  export interface ApiSearchFilter {
    searched: string
  }

  export enum CategoryLabel {
    PLA = 'Plaisance',
    PRO = 'Professionnel'
  }

  export enum AisTrackSettingsEnum {
    TWELVE_HOURS = 'TWELVE_HOURS',
    TWENTY_FOUR_HOURS = 'TWENTY_FOUR_HOURS',
    THREE_DAYS = 'THREE_DAYS',
    SPECIFIC_PERIOD = 'SPECIFIC_PERIOD'
  }

  export enum AisTrackSettingsLabel {
    TWELVE_HOURS = '12 heures',
    TWENTY_FOUR_HOURS = '24 heures',
    THREE_DAYS = '3 jours',
    SPECIFIC_PERIOD = 'Période spécifique'
  }

  export interface Position {
    course?: number
    destination?: string
    geom?: GeoJSON.Point
    heading?: number
    id: number
    mmsi?: number
    shipName?: string
    speed?: number
    status?: string
    timestamp?: string
  }
}
