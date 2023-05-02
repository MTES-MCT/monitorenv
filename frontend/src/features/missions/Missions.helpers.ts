import { v4 as uuidv4 } from 'uuid'

import {
  ActionTypeEnum,
  NewEnvAction,
  FormalNoticeEnum,
  MissionSourceEnum,
  Mission,
  NewMission,
  InfractionTypeEnum,
  EnvAction
} from '../../domain/entities/missions'

import type { ControlUnit } from '../../domain/entities/controlUnit'

export const infractionFactory = ({ id, ...infraction } = { id: '' }) => ({
  id: uuidv4(),
  natinf: [],
  observations: '',
  toProcess: false,
  ...infraction
})

export const actionFactory = ({
  actionType,
  id,
  ...action
}: Partial<EnvAction> & { actionType: ActionTypeEnum }): NewEnvAction => {
  switch (actionType) {
    case ActionTypeEnum.CONTROL:
      return {
        actionNumberOfControls: undefined,
        actionTargetType: undefined,
        actionType: ActionTypeEnum.CONTROL,
        id: uuidv4(),
        infractions: [],
        observations: '',
        themes: [{ subThemes: [], theme: '' }],
        ...action
      }
    case ActionTypeEnum.NOTE:
      return {
        actionStartDateTimeUtc: new Date().toISOString(),
        actionType: ActionTypeEnum.NOTE,
        id: uuidv4(),
        observations: '',
        ...action
      }
    case ActionTypeEnum.SURVEILLANCE:
    default:
      return {
        actionType: ActionTypeEnum.SURVEILLANCE,
        coverMissionZone: true,
        durationMatchesMission: true,
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
  hasMissionOrder: false,
  isClosed: false,
  isUnderJdp: false,
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
  const infraSansPV = infractions?.filter(inf => inf.infractionType !== InfractionTypeEnum.WITH_REPORT)?.length || 0
  const med = infractions?.filter(inf => inf.formalNotice === FormalNoticeEnum.YES)?.length || 0

  return { infra, infraSansPV, med, ras }
}
