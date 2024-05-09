import { v4 as uuidv4 } from 'uuid'

import { Mission } from './mission.type'
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

export const infractionFactory = (infraction?: Partial<Mission.Infraction>): Mission.NewInfraction => ({
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
}: Partial<Mission.EnvAction> & { actionType: Mission.ActionTypeEnum }): Mission.NewEnvAction => {
  switch (actionType) {
    case Mission.ActionTypeEnum.CONTROL:
      return {
        actionNumberOfControls: undefined,
        actionTargetType: undefined,
        actionType: Mission.ActionTypeEnum.CONTROL,
        completion: Mission.CompletionStatus.TO_COMPLETE,
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
      } as Mission.NewEnvActionControl
    case Mission.ActionTypeEnum.NOTE:
      return {
        actionStartDateTimeUtc: new Date().toISOString(),
        actionType: Mission.ActionTypeEnum.NOTE,
        id: uuidv4(),
        observations: '',
        ...action
      } as Mission.EnvActionNote
    case Mission.ActionTypeEnum.SURVEILLANCE:
    default:
      return {
        actionType: Mission.ActionTypeEnum.SURVEILLANCE,
        completion: Mission.CompletionStatus.TO_COMPLETE,
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
      } as Mission.EnvActionSurveillance
  }
}

export const missionFactory = (
  mission: AtLeast<Partial<Mission.Mission>, 'id'> | Partial<Mission.NewMission>,
  isNewMission: boolean,
  attachedReporting?: ReportingDetailed | undefined
): Mission.Mission | Mission.NewMission => {
  const startDate = new Date()
  startDate.setSeconds(0, 0)

  let formattedMission = {
    attachedReportingIds: attachedReporting ? [attachedReporting.id as number] : [],
    attachedReportings: attachedReporting ? [attachedReporting] : [],
    completedBy: '',
    controlUnits: [controlUnitFactory()],
    detachedReportingIds: [],
    endDateTimeUtc: '',
    envActions: [],
    fishActions: [],
    isGeometryComputedFromControls: false,
    isUnderJdp: false,
    missionSource: Mission.MissionSourceEnum.MONITORENV,
    missionTypes: [],
    observationsCacem: '',
    observationsCnsp: '',
    openBy: '',
    startDateTimeUtc: startDate.toISOString(),
    ...mission
  }

  if (isNewMission) {
    return formattedMission as Mission.NewMission
  }

  const { envActions } = mission as Mission.Mission
  const surveillances = envActions?.filter(action => action.actionType === Mission.ActionTypeEnum.SURVEILLANCE)

  const surveillanceWithSamePeriodIndex =
    surveillances?.length === 1
      ? envActions?.findIndex(
          action =>
            action.actionType === Mission.ActionTypeEnum.SURVEILLANCE &&
            action.actionEndDateTimeUtc === mission?.endDateTimeUtc &&
            action.actionStartDateTimeUtc === mission?.startDateTimeUtc
        )
      : -1
  if (surveillanceWithSamePeriodIndex !== -1 && envActions?.length > 0) {
    const envActionsUpdated: Mission.EnvAction[] = [...envActions]
    const surveillance: Mission.EnvActionSurveillance = {
      ...(envActionsUpdated[surveillanceWithSamePeriodIndex] as Mission.EnvActionSurveillance),
      durationMatchesMission: true
    }

    envActionsUpdated.splice(surveillanceWithSamePeriodIndex, 1, surveillance)

    formattedMission = {
      ...formattedMission,
      envActions: envActionsUpdated
    }
  }

  return formattedMission as Mission.Mission
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
    infractions?.filter(inf => inf.infractionType === Mission.InfractionTypeEnum.WITH_REPORT)?.length || 0
  const infractionsWithoutReport =
    infractions?.filter(inf => inf.infractionType === Mission.InfractionTypeEnum.WITHOUT_REPORT)?.length || 0
  const infractionsWithWaitingReport =
    infractions?.filter(inf => inf.infractionType === Mission.InfractionTypeEnum.WAITING)?.length || 0
  const med = infractions?.filter(inf => inf.formalNotice === Mission.FormalNoticeEnum.YES)?.length || 0

  return { infractionsWithoutReport, infractionsWithReport, infractionsWithWaitingReport, med, ras, totalInfractions }
}

export type ActionsForTimeLine = Record<string, Mission.ActionsTypeForTimeLine>

const formattedEnvActionsForTimeline = (envActions, attachedReportings) =>
  envActions?.reduce((newEnvActionsCollection, action) => {
    if (action.actionType === Mission.ActionTypeEnum.CONTROL && action.reportingIds?.length === 1) {
      const attachedReporting = attachedReportings?.find(reporting => reporting.id === action.reportingIds[0])

      return {
        ...newEnvActionsCollection,
        [action.id]: {
          ...action,
          actionSource: Mission.ActionSource.MONITORENV,
          formattedReportingId: getFormattedReportingId(attachedReporting?.reportingId),
          timelineDate: action?.actionStartDateTimeUtc
        }
      }
    }

    if (action.actionType === Mission.ActionTypeEnum.SURVEILLANCE) {
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
          actionSource: Mission.ActionSource.MONITORENV,
          formattedReportingIds,
          timelineDate: action?.actionStartDateTimeUtc
        }
      }
    }

    return {
      ...newEnvActionsCollection,
      [action.id]: {
        ...action,
        actionSource: Mission.ActionSource.MONITORENV,
        timelineDate: action?.actionStartDateTimeUtc
      }
    }
  }, {} as Mission.EnvActionForTimeline) || []

const formattedReportingsForTimeline = attachedReportings =>
  attachedReportings?.reduce(
    (newReportingsCollection, reporting) => ({
      ...newReportingsCollection,
      [reporting.id]: {
        ...reporting,
        actionSource: Mission.ActionSource.MONITORENV,
        actionType: Mission.ActionTypeEnum.REPORTING,
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
          actionSource: Mission.ActionSource.MONITORENV,
          actionType: Mission.ActionTypeEnum.DETACHED_REPORTING,
          timelineDate: detachedReporting?.attachedToMissionAtUtc
        },
        [`detach-${detachedReporting.reportingId}`]: {
          ...detachedReporting,
          action: 'detach',
          actionSource: Mission.ActionSource.MONITORENV,
          actionType: Mission.ActionTypeEnum.DETACHED_REPORTING,
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
        actionSource: Mission.ActionSource.MONITORFISH,
        actionType: fishAction.actionType,
        timelineDate: fishAction?.actionDatetimeUtc
      }
    }),
    {} as FishMissionAction.FishActionForTimeline
  ) || []

export const getEnvActionsAndReportingsForTimeline = (
  envActions: Mission.EnvAction[] | undefined,
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
