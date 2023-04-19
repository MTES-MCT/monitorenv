import { v4 as uuidv4 } from 'uuid'

import {
  ActionTypeEnum,
  actionTypeEnum,
  NewEnvAction,
  formalNoticeEnum,
  infractionTypeEnum,
  MissionSourceEnum,
  Mission,
  NewMission
} from '../../domain/entities/missions'

import type { ControlUnit } from '../../domain/entities/controlUnit'

export const infractionFactory = ({ id, ...infraction } = { id: '' }) => ({
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
  id?: string
}): NewEnvAction => {
  switch (actionType) {
    case actionTypeEnum.CONTROL.code:
      return {
        actionNumberOfControls: undefined,
        actionTargetType: undefined,
        id: uuidv4(),
        infractions: [],
        themes: [{ subThemes: [], theme: '' }],
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
        actionType: ActionTypeEnum.SURVEILLANCE,
        coverMissionZone: true,
        duration: 0,
        id: uuidv4(),
        observations: '',
        themes: [{ subThemes: [], theme: '' }],
        ...action
      }
  }
}

export const missionFactory = (mission = {}): Mission | NewMission => ({
  closedBy: '',
  controlUnits: [controlUnitFactory()],
  endDateTimeUtc: '',
  envActions: [],
  isClosed: false,
  missionNature: [],
  missionSource: MissionSourceEnum.MONITORENV,
  missionTypes: [],
  observationsCacem: '',
  observationsCnsp: '',
  openBy: '',
  startDateTimeUtc: new Date().toISOString(),
  ...mission
})

export const controlUnitFactory = ({ ...resourceUnit } = {}): Omit<ControlUnit, 'id'> => ({
  administration: '',
  isArchived: false,
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
