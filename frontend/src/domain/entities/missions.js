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

export const actionTargetTypeEnum = {
  VEHICLE: {
    code: 'VEHICLE',
    libelle: 'Véhicule',
  },
  COMPANY: {
    code: 'COMPANY',
    libelle: 'Société'
  },
  INDIVIDUAL: {
    code: 'INDIVIDUAL',
    libelle: 'Personne physique'
  }
}

export const vehicleTypeEnum = {
  VESSEL: {
    code: 'VESSEL',
    libelle: 'Navire'
  },
  OTHER_SEA: {
    code: 'OTHER_SEA',
    libelle: 'Autre véhicule marin'
  },
  VEHICLE_LAND: {
    code: 'VEHICLE_LAND',
    libelle: 'Véhicule terrestre'
  },
  VEHICLE_AIR: {
    code: 'VEHICLE_AIR',
    libelle: 'Véhicule aérien'
  }
}

export const vesselSizeEnum = {
  LESS_THAN_12m : {
    code: 'LESS_THAN_12m',
    libelle: 'moins de 12 m'
  },
  FROM_12_TO_24m: {
    code: 'FROM_12_TO_24m',
    libelle: '12 à 24 m'
  },
  FROM_24_TO_46m: {
    code: 'FROM_24_TO_46m',
    libelle: 'plus de 24 m'
  },
  MORE_THAN_46m:{
    code: 'MORE_THAN_46m',
    libelle: 'plus de 46 m'
  }
}

export const protectedSpeciesEnum = {
  MARINE_MAMMALS:{
    code: 'MARINE_MAMMALS',
    libelle: 'Mammifères marins',
    },
  REPTILES:{
    code: 'REPTILES',
    libelle: 'Reptiles',
    },
  BIRDS:{
    code: 'BIRDS',
    libelle: 'Oiseaux',
    },
  FLORA:{
    code: 'FLORA',
    libelle: 'Flore',
    },
  HABITAT:{
    code: 'HABITAT',
    libelle: 'Habitat',
    },
  OTHER:{
    code: 'OTHER',
    libelle: 'Autres espèces protégées',
  }
}

export const THEME_REQUIRE_PROTECTED_SPECIES = [17]