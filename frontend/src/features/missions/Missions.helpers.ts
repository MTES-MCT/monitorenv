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
import {
  type DetachedReporting,
  type Reporting,
  type ReportingDetailed,
  type ReportingForTimeline,
  type DetachedReportingForTimeline
} from '../../domain/entities/reporting'
import { getFormattedReportingId } from '../Reportings/utils'

// import type { ControlPlansData } from '../../domain/entities/controlPlan'
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
  /* const formattedControlPlanSubThemes = action.controlPlans?.map(({ subThemes, tags, theme }) => ({
    subThemes: subThemes?.map(subTheme => subTheme.id) || [],
    tags: tags?.map(tag => tag.value) || [],
    theme
  })) */

  switch (actionType) {
    case ActionTypeEnum.CONTROL:
      return {
        actionNumberOfControls: undefined,
        actionTargetType: undefined,
        actionType: ActionTypeEnum.CONTROL,
        controlPlans: [],
        id: uuidv4(),
        infractions: [],
        observations: '',
        reportingIds: [],
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
        controlPlans: [],
        coverMissionZone: true,
        durationMatchesMission: true,
        id: uuidv4(),
        observations: '',
        reportingIds: [],
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
  attachedReporting?: ReportingDetailed | undefined
): Mission | NewMission => {
  const startDate = new Date()
  startDate.setSeconds(0, 0)

  let formattedMission: NewMission = {
    attachedReportingIds: attachedReporting ? [attachedReporting.id as number] : [],
    attachedReportings: attachedReporting ? [attachedReporting] : [],
    closedBy: '',
    controlUnits: [controlUnitFactory()],
    detachedReportingIds: [],
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

    /*     const formattedActionsWithControlPlanSubThemes = envActionsUpdated.map(action => {
      if (action.actionType === ActionTypeEnum.CONTROL) {
        action.controlPlans.reduce((newControlsCollection, controlPlan) => {
          const themeIndex = newControlsCollection.findIndex(({ theme }) => theme === controlPlan.theme)
          if (themeIndex !== -1) {
            const updatedSubThemes = {
              ...newControlPlanSubThemesCollection[themeIndex],
              subThemes: newControlPlanSubThemesCollection[themeIndex].push(controlPlanSubTheme.subTheme)
            }
            newControlPlanSubThemesCollection[themeIndex] = [...newControlPlanSubThemesCollection[themeIndex]]
          }
        }, [] as ControlPlanSubThemeData[])

               const formattedControlPlanSubThemes = action.controlPlanSubThemes?.map(({ subThemes, tags, theme }) => ({
          subThemes: subThemes?.map(subTheme => subTheme.id) || [],
          tags: tags?.map(tag => tag) || [],
          theme
        })) 

        return {
          ...action,
          controlPlanSubThemes: formattedControlPlanSubThemes
        }
      }

      return action
    }) */

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

type ActionsForTimeLine = Record<string, ReportingForTimeline | EnvActionForTimeline>

const formattedEnvActionsForTimeline = (envActions, attachedReportings) =>
  envActions?.reduce((newEnvActionsCollection, action) => {
    if (action.actionType === ActionTypeEnum.CONTROL && action.reportingIds.length === 1) {
      const attachedReporting = attachedReportings?.find(reporting => reporting.id === action.reportingIds[0])

      return {
        ...newEnvActionsCollection,
        [action.id]: {
          ...action,
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
          formattedReportingIds,
          timelineDate: action?.actionStartDateTimeUtc
        }
      }
    }

    return {
      ...newEnvActionsCollection,
      [action.id]: {
        ...action,
        timelineDate: action?.actionStartDateTimeUtc
      }
    }
  }, {} as EnvActionForTimeline)

const formattedReportingsForTimeline = attachedReportings =>
  attachedReportings.reduce(
    (newReportingsCollection, reporting) => ({
      ...newReportingsCollection,
      [reporting.id]: {
        ...reporting,
        actionType: ActionTypeEnum.REPORTING,
        timelineDate: reporting?.attachedToMissionAtUtc
      }
    }),
    {} as ReportingForTimeline
  )

const formattedDetachedReportingsForTimeline = (detachedReportings, attachedReportingIds) => {
  const filteredDetachedReportings = detachedReportings?.filter(
    detachedreporting => !attachedReportingIds?.includes(detachedreporting.id)
  )

  return filteredDetachedReportings?.reduce(
    (newDetachedReportingsCollection, detachedReporting) => ({
      ...newDetachedReportingsCollection,
      [`attach-${detachedReporting.reportingId}`]: {
        ...detachedReporting,
        action: 'attach',
        actionType: ActionTypeEnum.DETACHED_REPORTING,
        timelineDate: detachedReporting?.attachedToMissionAtUtc
      },
      [`detach-${detachedReporting.reportingId}`]: {
        ...detachedReporting,
        action: 'detach',
        actionType: ActionTypeEnum.DETACHED_REPORTING,
        timelineDate: detachedReporting?.detachedFromMissionAtUtc
      }
    }),
    {} as DetachedReportingForTimeline
  )
}

export const getEnvActionsAndReportingsForTimeline = (
  envActions: EnvAction[] | undefined,
  attachedReportings: Reporting[] | undefined,
  detachedReportings: DetachedReporting[] | undefined,
  attachedReportingIds: number[] | undefined
): ActionsForTimeLine => {
  const formattedEnvActions = formattedEnvActionsForTimeline(envActions, attachedReportings)
  const formattedReportings = formattedReportingsForTimeline(attachedReportings)
  const formattedDetachedReportings = formattedDetachedReportingsForTimeline(detachedReportings, attachedReportingIds)

  return { ...formattedEnvActions, ...formattedReportings, ...formattedDetachedReportings }
}
