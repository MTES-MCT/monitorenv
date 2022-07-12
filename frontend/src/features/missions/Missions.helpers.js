import { v4 as uuidv4 } from 'uuid'

import { formalNoticeEnum, missionStatusEnum, missionTypeEnum } from "../../domain/entities/missions"

export const infractionFactory = () => {
  return {
    id: uuidv4(),
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
    id: uuidv4(),
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

export const getMissionStatus = (mission) => {
  try {
    if (mission?.inputStartDatetimeUtc > mission?.inputEndDatetimeUtc) {
      return missionStatusEnum.CLOSED.code
    }
  }
  catch {
    return missionStatusEnum.PENDING.code
  }
  return missionStatusEnum.PENDING.code
}