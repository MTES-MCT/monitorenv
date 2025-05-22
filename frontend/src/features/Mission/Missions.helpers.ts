import { v4 as uuidv4 } from 'uuid'

import {
  ActionSource,
  type ActionsTypeForTimeLine,
  ActionTypeEnum,
  CompletionStatus,
  type EnvAction,
  type EnvActionForTimeline,
  type EnvActionNote,
  type EnvActionSurveillance,
  FormalNoticeEnum,
  type Infraction,
  InfractionSeizureEnum,
  InfractionTypeEnum,
  type Mission,
  MissionSourceEnum,
  type NewEnvAction,
  type NewEnvActionControl,
  type NewInfraction,
  type NewMission
} from '../../domain/entities/missions'
import {
  type DetachedReporting,
  type DetachedReportingForTimeline,
  type Reporting,
  type ReportingForTimeline
} from '../../domain/entities/reporting'
import { getFormattedReportingId } from '../Reportings/utils'

import type { FishMissionAction } from './fishActions.types'
import type { LegacyControlUnit } from '../../domain/entities/legacyControlUnit'
import type { AtLeast } from '../../types'

export const infractionFactory = (infraction?: Partial<Infraction>): NewInfraction => ({
  administrativeResponse: 'NONE',
  natinf: [],
  nbTarget: 1,
  observations: '',
  seizure: InfractionSeizureEnum.NO,
  ...infraction,
  id: uuidv4()
})

export const actionFactory = ({
  actionType,
  id,
  ...action
}: Partial<EnvAction> & { actionType: ActionTypeEnum }): NewEnvAction => {
  let actionToDuplicate = action
  switch (actionType) {
    case ActionTypeEnum.CONTROL:
      if ('infractions' in actionToDuplicate) {
        actionToDuplicate = {
          ...actionToDuplicate,
          infractions: actionToDuplicate.infractions?.map(infraction => infractionFactory(infraction))
        }
      }

      return {
        actionNumberOfControls: undefined,
        actionTargetType: undefined,
        actionType: ActionTypeEnum.CONTROL,
        completion: CompletionStatus.TO_COMPLETE,
        infractions: [],
        observations: '',
        reportingIds: [],
        tags: [],
        themes: [],
        ...actionToDuplicate,
        id: uuidv4()
      } as NewEnvActionControl
    case ActionTypeEnum.NOTE:
      return {
        actionStartDateTimeUtc: new Date().toISOString(),
        actionType: ActionTypeEnum.NOTE,
        observations: '',
        ...actionToDuplicate,
        id: uuidv4()
      } as EnvActionNote
    case ActionTypeEnum.SURVEILLANCE:
    default:
      return {
        actionType: ActionTypeEnum.SURVEILLANCE,
        completion: CompletionStatus.TO_COMPLETE,
        durationMatchesMission: true,
        observations: '',
        reportingIds: [],
        tags: [],
        themes: [],
        ...actionToDuplicate,
        id: uuidv4()
      } as EnvActionSurveillance
  }
}

export const missionFactory = (
  mission: AtLeast<Partial<Mission>, 'id'> | Partial<NewMission>,
  isNewMission: boolean,
  attachedReporting?: Reporting | undefined
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

export const getControlInfractionsTags = (actionNumberOfControls: number, infractions: Infraction[]) => {
  const totalInfractions = infractions?.reduce((acc, infraction) => acc + infraction.nbTarget, 0)
  const ras = (actionNumberOfControls || 0) - totalInfractions

  const infractionsWithReport = infractions
    ?.filter(inf => inf.infractionType === InfractionTypeEnum.WITH_REPORT)
    .reduce((acc, infraction) => acc + infraction.nbTarget, 0)

  const infractionsWithoutReport = infractions
    ?.filter(inf => inf.infractionType === InfractionTypeEnum.WITHOUT_REPORT)
    .reduce((acc, infraction) => acc + infraction.nbTarget, 0)

  const infractionsWithWaitingReport = infractions
    ?.filter(inf => inf.infractionType === InfractionTypeEnum.WAITING)
    .reduce((acc, infraction) => acc + infraction.nbTarget, 0)

  const med = infractions
    ?.filter(inf => inf.formalNotice === FormalNoticeEnum.YES)
    .reduce((acc, infraction) => acc + infraction.nbTarget, 0)

  const sanctionAdmin = infractions
    ?.filter(inf => inf.administrativeResponse === 'SANCTION')
    .reduce((acc, infraction) => acc + infraction.nbTarget, 0)
  const regulAdmin = infractions
    ?.filter(inf => inf.administrativeResponse === 'REGULARIZATION')
    .reduce((acc, infraction) => acc + infraction.nbTarget, 0)

  const seizures = infractions
    ?.filter(inf => inf.seizure === InfractionSeizureEnum.YES)
    .reduce((acc, infraction) => acc + infraction.nbTarget, 0)

  return {
    infractionsWithoutReport,
    infractionsWithReport,
    infractionsWithWaitingReport,
    med,
    ras,
    regulAdmin,
    sanctionAdmin,
    seizures,
    totalInfractions
  }
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
