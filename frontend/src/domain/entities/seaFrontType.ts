// TODO change seaFront with Quater
// TODO Rename that to `SeaFront` and export it from to a `Global` namespace (if we keep domain/ on Env).
// Don't forget to mirror any update here in the backend enum.

export enum SeaFrontEnum {
  // TODO Why is it not in ALL MAJ? Does the DB has a mix of both cases (`Guadeloupe`, `SOUTH_INDIAN_OCEAN`)?
  CLIPPERTON = 'Clipperton',
  GUADELOUPE = 'Guadeloupe',
  GUYANE = 'Guyane',
  MARTINIQUE = 'Martinique',
  MAYOTTE = 'Mayotte',
  MED = 'MED',
  MEMN = 'MEMN',
  NAMO = 'NAMO',
  NEW_CALEDONIA = 'Nouvelle-Calédonie',
  // eslint-disable-next-line typescript-sort-keys/string-enum
  FRENCH_POLYNESIA = 'Polynésie Française',
  SA = 'SA',
  SAINT_PIERRE_ET_MIQUELON = 'Saint-Pierre-et-Miquelon',
  SOUTH_INDIAN_OCEAN = 'Sud Océan Indien',
  UNKNOWN = 'UNKNOWN',
  WALLIS_ET_FUTUNA = 'Wallis-et-Futuna'
}
export enum SeaFrontLabel {
  CLIPPERTON = 'Clipperton',
  GUADELOUPE = 'Guadeloupe',
  GUYANE = 'Guyane',
  MARTINIQUE = 'Martinique',
  MAYOTTE = 'Mayotte',
  MED = 'MED',
  MEMN = 'MEMN',
  NAMO = 'NAMO',
  NEW_CALEDONIA = 'Nouvelle-Calédonie',
  // eslint-disable-next-line typescript-sort-keys/string-enum
  FRENCH_POLYNESIA = 'Polynésie Française',
  SA = 'SA',
  SAINT_PIERRE_ET_MIQUELON = 'Saint-Pierre-et-Miquelon',
  SOUTH_INDIAN_OCEAN = 'Sud Océan Indien',
  UNKNOWN = 'Façade non renseignée',
  WALLIS_ET_FUTUNA = 'Wallis-et-Futuna'
}

export const SeaFrontLabels = {
  CLIPPERTON: {
    label: 'Clipperton',
    value: 'CLIPPERTON'
  },
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
  NEW_CALEDONIA: {
    label: 'Nouvelle-Calédonie',
    value: 'NOUVELLE_CALEDONIE'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  FRENCH_POLYNESIA: {
    label: 'Polynésie Française',
    value: 'POLYNESIE_FRANCAISE'
  },
  SA: {
    label: 'SA',
    value: 'SA'
  },
  SAINT_PIERRE_ET_MIQUELON: {
    label: 'Saint-Pierre-et-Miquelon',
    value: 'SAINT_PIERRE_ET_MIQUELON'
  },
  SOUTH_INDIAN_OCEAN: {
    label: 'Sud Océan Indien',
    value: 'Sud Océan Indien'
  },
  WALLIS_ET_FUTUNA: {
    label: 'Wallis-et-Futuna',
    value: 'WALLIS_ET_FUTUNA'
  }
}
