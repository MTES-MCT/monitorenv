import { v4 as uuidv4 } from 'uuid'

import {
  actionTargetTypeEnum,
  actionTypeEnum,
  formalNoticeEnum,
  infractionTypeEnum,
  missionStatusEnum,
  missionTypeEnum,
  vehicleTypeEnum
} from '../../domain/entities/missions'

export const infractionFactory = ({ id, ...infraction } = { id: undefined }) => ({
  // companyName: '',
  // controlledPersonIdentity: '',
  formalNotice: formalNoticeEnum.NO.code,
  id: uuidv4(),
  infractionType: infractionTypeEnum.WITHOUT_REPORT.code,
  natinf: [],
  observations: '',
  // registrationNumber: '',
  // relevantCourt: '',
  toProcess: false,
  // vesselSize: '',
  // vesselType: '',
  ...infraction
})

export const actionFactory = ({ actionType, id, ...action }) => {
  switch (actionType) {
    case actionTypeEnum.CONTROL.code:
      return {
        actionNumberOfControls: 0,
        actionStartDatetimeUtc: new Date().toISOString(),
        actionSubTheme: '',
        actionTargetType: actionTargetTypeEnum.VEHICLE.code,
        actionTheme: '',
        actionType: actionTypeEnum.CONTROL.code,
        geom: null,
        id: uuidv4(),
        infractions: [],
        protectedSpecies: [],
        vehicleType: vehicleTypeEnum.VESSEL.code,
        ...action
      }
    case actionTypeEnum.NOTE.code:
      return {
        actionStartDatetimeUtc: new Date().toISOString(),
        actionType: actionTypeEnum.NOTE.code,
        id: uuidv4(),
        observations: '',
        ...action
      }
    case actionTypeEnum.SURVEILLANCE.code:
      return {
        actionStartDatetimeUtc: new Date().toISOString(),
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

export const missionFactory = (mission = {}) => ({
  closedBy: '',
  envActions: [],
  geom: null,
  inputEndDatetimeUtc: '',
  inputStartDatetimeUtc: new Date().toISOString(),
  missionNature: [],
  missionStatus: missionStatusEnum.PENDING.code,
  missionType: missionTypeEnum.SEA.code,
  observations: '',
  openBy: '',
  resourceUnits: [resourceUnitFactory()],
  ...mission
})

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
