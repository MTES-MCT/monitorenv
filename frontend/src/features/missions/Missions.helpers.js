import { formalNoticeEnum, missionTypeEnum } from "../../domain/entities/missions"

export const infractionFactory = () => {
  return {
    natinf: [],
    observations: '',
    registrationNumber: '',
    vehicle: '',
    size: '',
    owner: '',
    infractionType: '',
    formalNotice: formalNoticeEnum.NO.code,
    relevantCourt: '',
    toProcess: '',
  }
}

export const actionFactory = (actionType) => {
  return {
    actionType,
    actionTheme: '',
    protectedSpecies: [],
    actionStartDatetimeUtc: new Date(),
    actionEndDatetimeUtc: new Date(),
    actionNumberOfControls: '',
    actionTargetType: '',
    vehicleType: '',
    geom: null,
    infractions: []
  }
}

export const missionFactory = () => {
  return {
    missionType: missionTypeEnum.SEA.code,
    unit: '',
    administration: '',
    open_by: '',
    closed_by: '',
    observations: '',
    theme: '',
    geom: null,
    inputStartDatetimeUtc: '',
    inputEndDatetimeUtc: '',
    actions: [],
    resources: [],
  }
}