import { v4 as uuidv4 } from 'uuid'

import {
  actionTargetTypeEnum,
  ActionTypeEnum,
  actionTypeEnum,
  formalNoticeEnum,
  infractionTypeEnum,
  MissionSourceEnum,
  missionTypeEnum,
  vehicleTypeEnum
} from '../../domain/entities/missions'

export const infractionFactory = ({ id, ...infraction } = { id: undefined }) => ({
  formalNotice: formalNoticeEnum.NO.code,
  id: uuidv4(),
  infractionType: infractionTypeEnum.WITHOUT_REPORT.code,
  natinf: [],
  observations: '',
  toProcess: false,
  ...infraction
})

export const actionFactory = ({ actionType, id, ...action }: { actionType: ActionTypeEnum; id?: number }) => {
  switch (actionType) {
    case actionTypeEnum.CONTROL.code:
      return {
        actionNumberOfControls: 0,
        actionStartDateTimeUtc: new Date().toISOString(),
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
        actionStartDateTimeUtc: new Date().toISOString(),
        actionType: actionTypeEnum.NOTE.code,
        id: uuidv4(),
        observations: '',
        ...action
      }
    case actionTypeEnum.SURVEILLANCE.code:
      return {
        actionStartDateTimeUtc: new Date().toISOString(),
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
  controlUnits: [controlUnitFactory()],
  envActions: [],
  geom: null,
  endDateTimeUtc: '',
  startDateTimeUtc: new Date().toISOString(),
  isClosed: false,
  missionNature: [],
  missionSource: MissionSourceEnum.MONITORENV,
  missionType: missionTypeEnum.SEA.code,
  observationsCacem: '',
  observationsCnsp: '',
  openBy: '',
  ...mission
})

export const controlUnitFactory = ({ ...resourceUnit } = {}) => ({
  administration: '',
  name: '',
  resources: [],
  ...resourceUnit
})

export const getControlInfractionsTags = (actionNumberOfControls, infractions) => {
  const infra = infractions.length || 0
  const ras = (actionNumberOfControls || 0) - infra
  const infraSansPV =
    infractions?.filter(inf => inf.infractionType !== infractionTypeEnum.WITH_REPORT.code)?.length || 0
  const med = infractions?.filter(inf => inf.formalNotice === formalNoticeEnum.YES.code)?.length || 0

  return { infra, infraSansPV, med, ras }
}
