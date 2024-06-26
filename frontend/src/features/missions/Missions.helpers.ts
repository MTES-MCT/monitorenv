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
  type EnvActionForTimeline,
  type NewInfraction,
  type Infraction,
  type NewEnvActionControl,
  type EnvActionNote,
  ActionSource,
  CompletionStatus,
  type ActionsTypeForTimeLine
} from '../../domain/entities/missions'
import {
  type DetachedReporting,
  type Reporting,
  type ReportingDetailed,
  type ReportingForTimeline,
  type DetachedReportingForTimeline
} from '../../domain/entities/reporting'
import { getFormattedReportingId } from '../Reportings/utils'

import type { FishMissionAction } from './fishActions.types'
import type { LegacyControlUnit } from '../../domain/entities/legacyControlUnit'
import type { AtLeast } from '../../types'

export const infractionFactory = (infraction?: Partial<Infraction>): NewInfraction => ({
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
        completion: CompletionStatus.TO_COMPLETE,
        controlPlans: [
          {
            subThemeIds: [],
            tagIds: [],
            themeId: undefined
          }
        ],

        id: uuidv4(),
        infractions: [],
        observations: '',
        reportingIds: [],
        ...action
      } as NewEnvActionControl
    case ActionTypeEnum.NOTE:
      return {
        actionStartDateTimeUtc: new Date().toISOString(),
        actionType: ActionTypeEnum.NOTE,
        id: uuidv4(),
        observations: '',
        ...action
      } as EnvActionNote
    case ActionTypeEnum.SURVEILLANCE:
    default:
      return {
        actionType: ActionTypeEnum.SURVEILLANCE,
        completion: CompletionStatus.TO_COMPLETE,
        controlPlans: [
          {
            subThemeIds: [],
            tagIds: [],
            themeId: undefined
          }
        ],

        durationMatchesMission: true,
        id: uuidv4(),
        observations: '',
        reportingIds: [],
        ...action
      } as EnvActionSurveillance
  }
}

export const missionFactory = (
  mission: AtLeast<Partial<Mission>, 'id'> | Partial<NewMission>,
  isNewMission: boolean,
  attachedReporting?: ReportingDetailed | undefined
): Mission | NewMission => {
  const startDate = new Date()
  startDate.setSeconds(0, 0)

  let formattedMission = {
    attachedReportingIds: attachedReporting ? [attachedReporting.id as number] : [],
    attachedReportings: attachedReporting ? [attachedReporting] : [],
    completedBy: undefined,
    controlUnits: [controlUnitFactory()],
    detachedReportingIds: [],
    endDateTimeUtc: '',
    envActions: [],
    fishActions: [],
    isGeometryComputedFromControls: false,
    isUnderJdp: false,
    missionSource: MissionSourceEnum.MONITORENV,
    missionTypes: [],
    observationsCacem: '',
    observationsCnsp: '',
    openBy: undefined,
    startDateTimeUtc: startDate.toISOString(),
    ...mission
  }

  if (isNewMission) {
    return formattedMission as NewMission
  }

  const { envActions } = mission as Mission
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
  if (surveillanceWithSamePeriodIndex !== -1 && envActions?.length > 0) {
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
  const totalInfractions = infractions?.length || 0
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

export type ActionsForTimeLine = Record<string, ActionsTypeForTimeLine>

const formattedEnvActionsForTimeline = (envActions, attachedReportings) =>
  envActions?.reduce((newEnvActionsCollection, action) => {
    if (action.actionType === ActionTypeEnum.CONTROL && action.reportingIds?.length === 1) {
      const attachedReporting = attachedReportings?.find(reporting => reporting.id === action.reportingIds[0])

      return {
        ...newEnvActionsCollection,
        [action.id]: {
          ...action,
          actionSource: ActionSource.MONITORENV,
          formattedReportingId: getFormattedReportingId(attachedReporting?.reportingId),
          timelineDate: action?.actionStartDateTimeUtc
        }
      }
    }

    if (action.actionType === ActionTypeEnum.SURVEILLANCE) {
      const reportingsAttachedToSurveillances = attachedReportings?.filter(reporting =>
        action.reportingIds.includes(reporting.id)
      )

      const formattedReportingIds = reportingsAttachedToSurveillances.map(attachedReporting =>
        getFormattedReportingId(attachedReporting.reportingId)
      )

      return {
        ...newEnvActionsCollection,
        [action.id]: {
          ...action,
          actionSource: ActionSource.MONITORENV,
          formattedReportingIds,
          timelineDate: action?.actionStartDateTimeUtc
        }
      }
    }

    return {
      ...newEnvActionsCollection,
      [action.id]: {
        ...action,
        actionSource: ActionSource.MONITORENV,
        timelineDate: action?.actionStartDateTimeUtc
      }
    }
  }, {} as EnvActionForTimeline) || []

const formattedReportingsForTimeline = attachedReportings =>
  attachedReportings?.reduce(
    (newReportingsCollection, reporting) => ({
      ...newReportingsCollection,
      [reporting.id]: {
        ...reporting,
        actionSource: ActionSource.MONITORENV,
        actionType: ActionTypeEnum.REPORTING,
        timelineDate: reporting?.attachedToMissionAtUtc
      }
    }),
    {} as ReportingForTimeline
  ) || []

const formattedDetachedReportingsForTimeline = (detachedReportings, attachedReportingIds) => {
  const filteredDetachedReportings = detachedReportings?.filter(
    detachedreporting => !attachedReportingIds?.includes(detachedreporting.id)
  )

  return (
    filteredDetachedReportings?.reduce(
      (newDetachedReportingsCollection, detachedReporting) => ({
        ...newDetachedReportingsCollection,
        [`attach-${detachedReporting.reportingId}`]: {
          ...detachedReporting,
          action: 'attach',
          actionSource: ActionSource.MONITORENV,
          actionType: ActionTypeEnum.DETACHED_REPORTING,
          timelineDate: detachedReporting?.attachedToMissionAtUtc
        },
        [`detach-${detachedReporting.reportingId}`]: {
          ...detachedReporting,
          action: 'detach',
          actionSource: ActionSource.MONITORENV,
          actionType: ActionTypeEnum.DETACHED_REPORTING,
          timelineDate: detachedReporting?.detachedFromMissionAtUtc
        }
      }),
      {} as DetachedReportingForTimeline
    ) || []
  )
}
const formattedFishActionsForTimeline = fishActions =>
  fishActions?.reduce(
    (newFishActionsCollection, fishAction) => ({
      ...newFishActionsCollection,
      [fishAction.id]: {
        ...fishAction,
        actionSource: ActionSource.MONITORFISH,
        actionType: fishAction.actionType,
        timelineDate: fishAction?.actionDatetimeUtc
      }
    }),
    {} as FishMissionAction.FishActionForTimeline
  ) || []

export const getEnvActionsAndReportingsForTimeline = (
  envActions: EnvAction[] | undefined,
  attachedReportings: Reporting[] | undefined,
  detachedReportings: DetachedReporting[] | undefined,
  attachedReportingIds: number[] | undefined,
  fishActions: FishMissionAction.MissionAction[] | undefined
): ActionsForTimeLine => {
  const formattedEnvActions = formattedEnvActionsForTimeline(envActions, attachedReportings)
  const formattedReportings = formattedReportingsForTimeline(attachedReportings)
  const formattedDetachedReportings = formattedDetachedReportingsForTimeline(detachedReportings, attachedReportingIds)
  const formattedFishActions = formattedFishActionsForTimeline(fishActions)

  return { ...formattedEnvActions, ...formattedReportings, ...formattedDetachedReportings, ...formattedFishActions }
}
