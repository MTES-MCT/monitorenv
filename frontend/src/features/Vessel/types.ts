export namespace Vessel {
  export interface Identity {
    category?: string
    flag?: string
    id: number
    immatriculation?: string
    imo?: string
    mmsi?: string
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
}
