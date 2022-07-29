import { v4 as uuidv4 } from 'uuid'

import { formalNoticeEnum, missionStatusEnum, missionTypeEnum } from "../../domain/entities/missions"

export const infractionFactory = ({id, ...infraction} = {}) => {
  return {
    id: uuidv4(),
    natinf: [],
    observations: '',
    registrationNumber: '',
    vesselType: '',
    size: '',
    owner: '',
    infractionType: '',
    formalNotice: formalNoticeEnum.NO.code,
    relevantCourt: '',
    toProcess: '',
    ...infraction
  }
}

export const actionFactory = ({id, ...action} = {}) => {
  return {
    id: uuidv4(),
    actionType: '',
    actionTheme: '',
    protectedSpecies: [],
    actionStartDatetimeUtc: new Date(),
    actionNumberOfControls: '',
    actionTargetType: '',
    vehicleType: '',
    geom: null,
    infractions: [],
    ...action
  }
}

export const missionFactory = (mission) => {
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
    ...mission
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