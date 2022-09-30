import { v4 as uuidv4 } from 'uuid'

import {
  actionTypeEnum,
  formalNoticeEnum,
  infractionTypeEnum,
  missionStatusEnum,
  missionTypeEnum
} from '../../domain/entities/missions'

export const infractionFactory = ({ id, ...infraction } = {}) => ({
  companyName: '',
  controlledPersonIdentity: '',
  formalNotice: formalNoticeEnum.NO.code,
  id: uuidv4(),
  infractionType: '',
  natinf: [],
  observations: '',
  registrationNumber: '',
  relevantCourt: '',
  toProcess: '',
  vesselSize: '',
  vesselType: '',
  ...infraction
})

export const actionFactory = ({ actionType, id, ...action } = {}) => {
  switch (actionType) {
    case actionTypeEnum.CONTROL.code:
      return {
        actionNumberOfControls: '',
        actionStartDatetimeUtc: new Date(),
        actionSubTheme: '',
        actionTargetType: '',
        actionTheme: '',
        actionType: actionTypeEnum.CONTROL.code,
        geom: null,
        id: uuidv4(),
        infractions: [],
        protectedSpecies: [],
        vehicleType: '',
        ...action
      }
    case actionTypeEnum.NOTE.code:
      return {
        actionStartDatetimeUtc: new Date(),
        actionType: actionTypeEnum.NOTE.code,
        id: uuidv4(),
        observations: '',
        ...action
      }
    case actionTypeEnum.SURVEILLANCE.code:
      return {
        actionStartDatetimeUtc: new Date(),
        actionSubTheme: '',
        actionTheme: '',
        actionType: actionTypeEnum.SURVEILLANCE.code,
        geom: null,
        id: uuidv4(),
        protectedSpecies: [],
        ...action
      }
    default:
      return {
        actionType: '',
        id: uuidv4(),
        ...action
      }
  }
  
}

export const missionFactory = (mission) => {
  return {
    missionType: missionTypeEnum.SEA.code,
    missionNature: [],
    resourceUnits: [resourceUnitFactory()],
    missionStatus: missionStatusEnum.PENDING.code,
    openBy: '',
    closedBy: '',
    observations: '',
    geom: null,
    inputStartDatetimeUtc: new Date(),
    inputEndDatetimeUtc: '',
    envActions: [],
    ...mission
  }
}

export const resourceUnitFactory = ({ ...resourceUnit } = {}) => ({
  administration: '',
  resources: [],
  unit: '',
  ...resourceUnit
})

export const getControlInfractionsTags = (actionNumberOfControls, infractions) => {
  const infra = infractions.length || 0
  const ras = (actionNumberOfControls || 0) - infra
  const infraSansPV =
    infractions?.filter(inf => inf.infractionType === infractionTypeEnum.WITHOUT_REPORT.code)?.length || 0
  const med = infractions?.filter(inf => inf.formalNotice === formalNoticeEnum.YES.code)?.length || 0

  return { infra, infraSansPV, med, ras }
}
