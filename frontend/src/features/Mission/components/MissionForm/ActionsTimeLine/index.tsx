import { customDayjs as dayjs, Dropdown, Icon } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useCallback, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { ActionCard } from './ActionCard'
import {
  ActionTypeEnum,
  type ActionsTypeForTimeLine,
  type EnvAction,
  type Mission,
  type NewMission
} from '../../../../../domain/entities/missions'
import { actionFactory, getEnvActionsAndReportingsForTimeline } from '../../../Missions.helpers'
import { AttachReporting } from '../AttachReporting'
import { useUpdateMissionZone } from '../hooks/useUpdateMissionZone'
import { FormTitle, Separator } from '../style'

import type { DetachedReporting, Reporting } from '../../../../../domain/entities/reporting'
import type { FishMissionAction } from '../../../fishActions.types'

export function ActionsTimeLine({ currentActionId, setCurrentActionId }) {
  const actionTimelineRef = useRef<HTMLDivElement>(null)
  const actionTimelineHeight = Number(actionTimelineRef.current?.clientHeight) - 40 || undefined
  const { errors, setFieldValue, values } = useFormikContext<Partial<Mission | NewMission>>()

  const envActions = values?.envActions as EnvAction[]
  const fishActions = values?.fishActions as FishMissionAction.MissionAction[]
  const attachedReportings = values?.attachedReportings as Reporting[]
  const attachedReportingIds = values?.attachedReportingIds as number[]
  const detachedReportings = values?.detachedReportings as DetachedReporting[]
  const isFirstSurveillanceAction = !envActions?.find(action => action.actionType === ActionTypeEnum.SURVEILLANCE)

  const actions = useMemo(
    () =>
      getEnvActionsAndReportingsForTimeline(
        envActions,
        attachedReportings,
        detachedReportings,
        attachedReportingIds,
        fishActions
      ),
    [envActions, attachedReportings, detachedReportings, attachedReportingIds, fishActions]
  )

  const sortedActions: Array<ActionsTypeForTimeLine> = useMemo(
    () =>
      actions &&
      Object.values(actions).sort((a: any, b: any) => {
        if (a.timelineDate === undefined) {
          return -1
        }
        if (b.timelineDate === undefined) {
          return +1
        }

        return a.timelineDate && b.timelineDate && dayjs(a.timelineDate).isBefore(dayjs(b.timelineDate)) ? +1 : -1
      }),
    [actions]
  )

  useUpdateMissionZone(sortedActions)

  const handleAddSurveillanceAction = useCallback(() => {
    const newSurveillance = actionFactory({
      actionType: ActionTypeEnum.SURVEILLANCE,
      durationMatchesMission: isFirstSurveillanceAction,
      ...(isFirstSurveillanceAction && {
        actionEndDateTimeUtc: values?.endDateTimeUtc,
        actionStartDateTimeUtc: values?.startDateTimeUtc
      })
    })
    setFieldValue('envActions', [newSurveillance, ...(envActions || [])])
    setCurrentActionId(newSurveillance.id)
  }, [
    envActions,
    isFirstSurveillanceAction,
    setCurrentActionId,
    setFieldValue,
    values?.endDateTimeUtc,
    values?.startDateTimeUtc
  ])

  const handleAddControlAction = useCallback(() => {
    const newControl = actionFactory({ actionType: ActionTypeEnum.CONTROL })
    setFieldValue('envActions', [newControl, ...(envActions || [])])
    setCurrentActionId(newControl.id)
  }, [envActions, setCurrentActionId, setFieldValue])

  const handleAddNoteAction = useCallback(() => {
    const newNote = actionFactory({ actionType: ActionTypeEnum.NOTE })
    setFieldValue('envActions', [newNote, ...(envActions || [])])
    setCurrentActionId(newNote.id)
  }, [envActions, setCurrentActionId, setFieldValue])

  const handleSelectAction = useCallback(
    id => {
      setCurrentActionId(id)
    },
    [setCurrentActionId]
  )

  const handleRemoveAction = useCallback(
    (id, event) => {
      event.stopPropagation()
      if (!envActions) {
        return
      }

      const actionToDeleteIndex = envActions.findIndex(action => action.id === String(id))
      if (actionToDeleteIndex !== -1) {
        const actionsToUpdate = [...(envActions || [])]
        actionsToUpdate.splice(actionToDeleteIndex, 1)
        setFieldValue('envActions', actionsToUpdate)

        setCurrentActionId(undefined)
      }
    },
    [envActions, setCurrentActionId, setFieldValue]
  )

  const handleDuplicateAction = useCallback(
    (e, id) => {
      e.stopPropagation()
      const envAction = envActions && envActions.find(action => action.id === id)

      if (!envAction) {
        return
      }

      let newAction = { ...envAction }
      if ('reportingIds' in envAction) {
        newAction = { ...envAction, reportingIds: [] }
      }

      const duplicatedAction = actionFactory(newAction)
      setFieldValue('envActions', [duplicatedAction, ...envActions])
      setCurrentActionId(duplicatedAction.id)
    },
    [envActions, setFieldValue, setCurrentActionId]
  )

  return (
    <FormWrapper>
      <TitleWrapper>
        <FormTitle>Actions réalisées en mission</FormTitle>
        <ButtonsWrapper>
          <Dropdown Icon={Icon.Plus} noCaret title="Ajouter">
            <Dropdown.Item Icon={Icon.ControlUnit} onClick={handleAddControlAction}>
              Ajouter des contrôles
            </Dropdown.Item>
            <Dropdown.Item Icon={Icon.Observation} onClick={handleAddSurveillanceAction}>
              Ajouter une surveillance
            </Dropdown.Item>
            <Dropdown.Item Icon={Icon.Note} onClick={handleAddNoteAction}>
              Ajouter une note libre
            </Dropdown.Item>
          </Dropdown>

          <AttachReporting />
        </ButtonsWrapper>
      </TitleWrapper>
      <Separator />
      {values.hasRapportNavActions?.containsActionsAddedByUnit && (
        <RapportNavActionsText data-cy="rapportNav-actions-text">
          Des données ont été ajoutées par l&apos;unité dans la mission.
        </RapportNavActionsText>
      )}
      <ActionsTimeline ref={actionTimelineRef}>
        <VerticalLine $height={actionTimelineHeight} />
        {sortedActions ? (
          <>
            {sortedActions.map(action => {
              const envActionsIndex = envActions?.findIndex(a => a.id === action.id)
              const envActionsErrors =
                errors?.envActions &&
                envActionsIndex !== undefined &&
                envActionsIndex >= 0 &&
                errors?.envActions[envActionsIndex]

              return (
                <ActionCard
                  key={action.id}
                  action={action}
                  duplicateAction={e => handleDuplicateAction(e, action.id)}
                  hasError={!!envActionsErrors}
                  removeAction={event => handleRemoveAction(action.id, event)}
                  selectAction={() => handleSelectAction(action.id)}
                  selected={action.id === currentActionId}
                  setCurrentActionId={setCurrentActionId}
                />
              )
            })}
          </>
        ) : (
          <NoActionWrapper>
            <NoAction>Aucune action n&apos;est ajoutée pour le moment</NoAction>
          </NoActionWrapper>
        )}
      </ActionsTimeline>
    </FormWrapper>
  )
}

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 48px 32px 32px;
  color: ${p => p.theme.color.slateGray};
`
const TitleWrapper = styled.div`
  align-items: baseline;
  display: flex;
  justify-content: space-between;
`
const ButtonsWrapper = styled.div`
  display: flex;
  gap: 8px;

  // TODO update this in monitor-ui - Dropdown component
  > div {
    > button {
      padding: 5px 12px 6px !important;
    }
  }
`

const RapportNavActionsText = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
  font-style: italic;
`

const ActionsTimeline = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  position: relative;
`

const NoActionWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const NoAction = styled.div`
  text-align: center;
  font-style: italic;
`
const VerticalLine = styled.div<{ $height?: number }>`
  border-left: 1px solid ${p => p.theme.color.slateGray};
  height: ${p => p.$height ?? '0'};
  left: 4%;
  margin-top: 16px;
  position: absolute;
  width: 1px;
`
