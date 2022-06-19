export const ActionTypeEnum = {
  SURVEILLANCE: { 
    code: 'SURVEILLANCE',
    libelle: 'Surveillance'
  },
  CONTROL: {
    code: 'CONTROL',
    libelle: 'Contrôle'
  },
  NOTE: {
    code: 'NOTE',
    libelle: 'Note'
  }
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
    code: true,
    libelle: 'Sans PV'
  },
  WITH_REPORT: {
    code: false,
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
    code: 'PENDING',
    libelle: 'En attente'
  }
}
