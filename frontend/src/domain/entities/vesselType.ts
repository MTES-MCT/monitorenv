export enum VesselTypeEnum {
  COMMERCIAL = 'COMMERCIAL',
  FISHING = 'FISHING',
  MOTOR = 'MOTOR',
  SAILING = 'SAILING'
}

export const vesselTypeLabel: Record<VesselTypeEnum, string> = {
  COMMERCIAL: 'Commerce',
  FISHING: 'Pêche',
  MOTOR: 'Moteur',
  SAILING: 'Voilier'
}
