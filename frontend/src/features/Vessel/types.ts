export namespace Vessel {
  export interface Identity {
    flag?: string
    id: number
    immatriculation?: string
    imo?: string
    mmsi?: string
    shipName?: string
  }

  export interface Vessel extends Identity {
    category?: string
    commercialName?: string
    length?: number
    ownerBusinessSegment?: string
    ownerCompanyName?: string
    ownerDateOfBirth?: string
    ownerEmail?: string
    ownerFirstName?: string
    ownerLastName?: string
    ownerLegalStatus?: string
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
}
