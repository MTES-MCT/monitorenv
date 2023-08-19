import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import {
  ActionTypeEnum,
  NewEnvAction,
  FormalNoticeEnum,
  MissionSourceEnum,
  Mission,
  NewMission,
  InfractionTypeEnum,
  EnvAction,
  EnvActionSurveillance
} from '../../domain/entities/missions'

import type { ControlUnit } from '../../domain/entities/legacyControlUnit'

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
        themes: [],
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
        themes: [],
        ...action
      }
  }
}

export const missionFactory = (
  mission?: Mission | undefined,
  id?: number | string | undefined
): Mission | NewMission => {
  const startDate = new Date()
  startDate.setSeconds(0, 0)

  let formattedMission = {
    closedBy: '',
    controlUnits: [controlUnitFactory()],
    endDateTimeUtc: '',
    envActions: [],
    isClosed: false,
    isUnderJdp: false,
    missionSource: MissionSourceEnum.MONITORENV,
    missionTypes: [],
    observationsCacem: '',
    observationsCnsp: '',
    openBy: '',
    startDateTimeUtc: startDate.toISOString(),
    ...mission
  }

  if (_.isEmpty(mission)) {
    return {
      ...formattedMission,
      id
    } as NewMission
  }

  const { envActions } = mission
  const surveillances = envActions.filter(action => action.actionType === ActionTypeEnum.SURVEILLANCE)

  const surveillanceWithSamePeriodIndex =
    surveillances?.length === 1
      ? envActions.findIndex(
          action =>
            action.actionType === ActionTypeEnum.SURVEILLANCE &&
            action.actionEndDateTimeUtc === mission?.endDateTimeUtc &&
            action.actionStartDateTimeUtc === mission?.startDateTimeUtc
        )
      : -1
  if (surveillanceWithSamePeriodIndex !== -1 && envActions.length > 0) {
    const envActionsUpdated: EnvAction[] = [...envActions]
    const surveillance: EnvActionSurveillance = {
      ...(envActionsUpdated[surveillanceWithSamePeriodIndex] as EnvActionSurveillance),
      durationMatchesMission: true
    }

    envActionsUpdated.splice(surveillanceWithSamePeriodIndex, 1, surveillance)

    formattedMission = {
      ...formattedMission,
      envActions: envActionsUpdated
    }
  }

  return formattedMission as Mission
}

export const controlUnitFactory = ({ ...resourceUnit } = {}): Omit<ControlUnit, 'id'> => ({
  administration: '',
  isArchived: false,
  name: '',
  resources: [],
  ...resourceUnit
})

export const getControlInfractionsTags = (actionNumberOfControls, infractions) => {
  const totalInfractions = infractions.length || 0
  const ras = (actionNumberOfControls || 0) - totalInfractions
  const infractionsWithoutPV =
    infractions?.filter(inf => inf.infractionType === InfractionTypeEnum.WITHOUT_REPORT)?.length || 0
  const infractionsWithWaitingPv =
    infractions?.filter(inf => inf.infractionType === InfractionTypeEnum.WAITING)?.length || 0
  const med = infractions?.filter(inf => inf.formalNotice === FormalNoticeEnum.YES)?.length || 0

  return { infractionsWithoutPV, infractionsWithWaitingPv, med, ras, totalInfractions }
}
