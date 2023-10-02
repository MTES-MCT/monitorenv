import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import {
  ActionTypeEnum,
  type NewEnvAction,
  FormalNoticeEnum,
  MissionSourceEnum,
  type Mission,
  type NewMission,
  InfractionTypeEnum,
  type EnvAction,
  type EnvActionSurveillance,
  type EnvActionForTimeline
} from '../../domain/entities/missions'
import { getFormattedReportingId, type Reporting, type ReportingForTimeline } from '../../domain/entities/reporting'

import type { LegacyControlUnit } from '../../domain/entities/legacyControlUnit'

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
        themes: [
          {
            protectedSpecies: undefined,
            subThemes: [],
            theme: ''
          }
        ],
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
        themes: [
          {
            protectedSpecies: undefined,
            subThemes: [],
            theme: ''
          }
        ],
        ...action
      }
  }
}

export const missionFactory = (
  mission?: Mission | undefined,
  id?: number | string | undefined,
  attachedReporting?: Reporting | undefined
): Mission | NewMission => {
  const startDate = new Date()
  startDate.setSeconds(0, 0)

  let formattedMission: NewMission = {
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
    reportings: attachedReporting ? [attachedReporting] : [],
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
  const surveillances = envActions?.filter(action => action.actionType === ActionTypeEnum.SURVEILLANCE)

  const surveillanceWithSamePeriodIndex =
    surveillances?.length === 1
      ? envActions?.findIndex(
          action =>
            action.actionType === ActionTypeEnum.SURVEILLANCE &&
            action.actionEndDateTimeUtc === mission?.endDateTimeUtc &&
            action.actionStartDateTimeUtc === mission?.startDateTimeUtc
        )
      : -1
  if (
    surveillanceWithSamePeriodIndex &&
    surveillanceWithSamePeriodIndex !== -1 &&
    envActions &&
    envActions?.length > 0
  ) {
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

export const controlUnitFactory = ({ ...resourceUnit } = {}): Omit<LegacyControlUnit, 'administrationId' | 'id'> => ({
  administration: '',
  isArchived: false,
  name: '',
  resources: [],
  ...resourceUnit
})

export const getControlInfractionsTags = (actionNumberOfControls, infractions) => {
  const totalInfractions = infractions.length || 0
  const ras = (actionNumberOfControls || 0) - totalInfractions
  const infractionsWithReport =
    infractions?.filter(inf => inf.infractionType === InfractionTypeEnum.WITH_REPORT)?.length || 0
  const infractionsWithoutReport =
    infractions?.filter(inf => inf.infractionType === InfractionTypeEnum.WITHOUT_REPORT)?.length || 0
  const infractionsWithWaitingReport =
    infractions?.filter(inf => inf.infractionType === InfractionTypeEnum.WAITING)?.length || 0
  const med = infractions?.filter(inf => inf.formalNotice === FormalNoticeEnum.YES)?.length || 0

  return { infractionsWithoutReport, infractionsWithReport, infractionsWithWaitingReport, med, ras, totalInfractions }
}

type ActionsForTimeLine = Record<string, ReportingForTimeline | EnvActionForTimeline>

const formattedEnvActionsForTimeline = (envActions, reportings) =>
  envActions?.reduce((newEnvActionsCollection, action) => {
    let attachedReporting
    if (action.actionType === ActionTypeEnum.CONTROL && action.attachedReportingId) {
      attachedReporting = reportings?.find(reporting => reporting.id === action.attachedReportingId)
    }

    return {
      ...newEnvActionsCollection,
      [action.id]: {
        ...action,
        formattedReportingId: getFormattedReportingId(attachedReporting?.reportingId),
        timelineDate: action.actionStartDateTimeUtc
      }
    }
  }, {} as EnvActionForTimeline)

const formattedReportingsForTimeline = reportings =>
  reportings?.reduce(
    (newReportingsCollection, reporting) => ({
      ...newReportingsCollection,
      [reporting.id]: {
        ...reporting,
        actionType: ActionTypeEnum.REPORTING,
        timelineDate: reporting.attachedToMissionAtUtc
      }
    }),
    {} as ReportingForTimeline
  )
export const getEnvActionsAndReportingsForTimeline = (
  envActions: EnvAction[] | undefined,
  reportings: Reporting[] | undefined
): ActionsForTimeLine => {
  const formattedEnvActions = formattedEnvActionsForTimeline(envActions, reportings)
  const formattedReportings = formattedReportingsForTimeline(reportings)

  return { ...formattedEnvActions, ...formattedReportings }
}
