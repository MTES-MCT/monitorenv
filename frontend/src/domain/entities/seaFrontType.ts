// TODO change seaFront with Quater
// TODO Rename that to `SeaFront` and export it from to a `Global` namespace (if we keep domain/ on Env).
// Don't forget to mirror any update here in the backend enum.
export enum SeaFrontEnum {
  // TODO Why is it not in ALL MAJ? Does the DB has a mix of both cases (`Guadeloupe`, `SOUTH_INDIAN_OCEAN`)?
  GUADELOUPE = 'Guadeloupe',
  GUYANE = 'Guyane',
  MARTINIQUE = 'Martinique',
  MAYOTTE = 'Mayotte',
  MED = 'MED',
  MEMN = 'MEMN',
  NAMO = 'NAMO',
  SA = 'SA',
  SOUTH_INDIAN_OCEAN = 'SOUTH_INDIAN_OCEAN',
  UNKNOWN = 'UNKNOWN'
}
export enum SeaFrontLabel {
  GUADELOUPE = 'Guadeloupe',
  GUYANE = 'Guyane',
  MARTINIQUE = 'Martinique',
  MAYOTTE = 'Mayotte',
  MED = 'MED',
  MEMN = 'MEMN',
  NAMO = 'NAMO',
  SA = 'SA',
  SOUTH_INDIAN_OCEAN = 'Sud Océan Indien',
  UNKNOWN = 'Façade non renseignée'
}

export const SeaFrontLabels = {
  GUADELOUPE: {
    label: 'Guadeloupe',
    value: 'Guadeloupe'
  },
  GUYANE: {
    label: 'Guyane',
    value: 'Guyane'
  },
  MARTINIQUE: {
    label: 'Martinique',
    value: 'Martinique'
  },
  MAYOTTE: {
    label: 'Mayotte',
    value: 'Mayotte'
  },
  MED: {
    label: 'MED',
    value: 'MED'
  },
  MEMN: {
    label: 'MEMN',
    value: 'MEMN'
  },
  NAMO: {
    label: 'NAMO',
    value: 'NAMO'
  },
  SA: {
    label: 'SA',
    value: 'SA'
  },
  SOUTH_INDIAN_OCEAN: {
    label: 'Sud Océan Indien',
    value: 'Sud Océan Indien'
  }
}
