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
    lastPositions?: LastPosition[]
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

  export interface LastPosition {
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
