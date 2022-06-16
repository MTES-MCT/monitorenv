export const ActionTypeEnum = {
  SURVEILLANCE: 'SURVEILLANCE',
  CONTROL: 'CONTROL'
}

export const missionTypeEnum = {
  SEA: {
    code: 'SEA',
    libelle: 'Mer'
  },
  LAND: {
    code: 'LAND',
    libelle: 'Terre'
  },
  AIR: {
    code: 'AIR',
    libelle: 'Air'
  }
}

export const missionNatureEnum = {
  ENV: {
    code: 'ENV',
    libelle: 'Env'
  },
  FISH: {
    code: 'FISH',
    libelle: 'Pêche'
  },
  OTHER: {
    code: 'OTHER',
    libelle: 'Autre'
  }
}

export const infractionTypeEnum = {
  WITHOUT_REPORT: {
    code: 'WITHOUT_REPORT',
    libelle: 'Sans PV'
  },
  WITH_REPORT: {
    code: 'WITH_REPORT',
    libelle: 'Avec PV'
  }
}

export const formalNoticeEnum = {
  YES: {
    code: 'YES',
    libelle: 'Oui'
  },
  NO: {
    code: 'NO',
    libelle: 'Non'
  },
  WAITING: {
    code: 'WAITING',
    libelle: 'En attente'
  }
}
