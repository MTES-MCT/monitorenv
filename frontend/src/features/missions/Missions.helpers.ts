import { v4 as uuidv4 } from 'uuid'

import {
  actionTargetTypeEnum,
  ActionTypeEnum,
  actionTypeEnum,
  EnvActionType,
  formalNoticeEnum,
  infractionTypeEnum,
  MissionSourceEnum,
  MissionType,
  MissionTypeEnum,
  NewMissionType,
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

export const actionFactory = ({
  actionType,
  id,
  ...action
}: {
  actionType: ActionTypeEnum
  id?: number
}): EnvActionType => {
  switch (actionType) {
    case actionTypeEnum.CONTROL.code:
      return {
        actionNumberOfControls: 0,
        actionSubTheme: '',
        actionTargetType: actionTargetTypeEnum.VEHICLE.code,
        actionTheme: '',
        actionType: ActionTypeEnum.CONTROL,
        id: uuidv4(),
        infractions: [],
        vehicleType: vehicleTypeEnum.VESSEL.code,
        ...action
      }
    case actionTypeEnum.NOTE.code:
      return {
        actionType: ActionTypeEnum.NOTE,
        id: uuidv4(),
        observations: '',
        ...action
      }
    case actionTypeEnum.SURVEILLANCE.code:
    default:
      return {
        actionSubTheme: '',
        actionTheme: '',
        actionType: ActionTypeEnum.SURVEILLANCE,
        coverMissionZone: true,
        duration: 0,
        id: uuidv4(),
        observations: '',
        ...action
      }
  }
}

export const missionFactory = (mission = {}): MissionType | NewMissionType => ({
  closedBy: '',
  envActions: [],
  isClosed: false,
  missionNature: [],
  missionSource: MissionSourceEnum.CACEM,
  missionType: MissionTypeEnum.SEA,
  observationsCacem: '',
  observationsCnsp: '',
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
    infractions?.filter(inf => inf.infractionType !== infractionTypeEnum.WITH_REPORT.code)?.length || 0
  const med = infractions?.filter(inf => inf.formalNotice === formalNoticeEnum.YES.code)?.length || 0

  return { infra, infraSansPV, med, ras }
}
