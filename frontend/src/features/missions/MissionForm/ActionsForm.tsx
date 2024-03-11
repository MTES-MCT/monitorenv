import { customDayjs as dayjs, Dropdown, Icon } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { ActionCards } from './ActionCards'
import { AttachReporting } from './AttachReporting'
import { useUpdateMissionZone } from './hooks/useUpdateMissionZone'
import { ActionTypeEnum, type EnvAction, type Mission, type NewMission } from '../../../domain/entities/missions'
import { actionFactory, getEnvActionsAndReportingsForTimeline } from '../Missions.helpers'

import type { DetachedReporting, Reporting } from '../../../domain/entities/reporting'

export function ActionsForm({ currentActionIndex, setCurrentActionIndex }) {
  const { errors, setFieldValue, values } = useFormikContext<Partial<Mission | NewMission>>()

  const envActions = values?.envActions as EnvAction[]
  const attachedReportings = values?.attachedReportings as Reporting[]
  const attachedReportingIds = values?.attachedReportingIds as number[]
  const detachedReportings = values?.detachedReportings as DetachedReporting[]
  const isFirstSurveillanceAction = !envActions?.find(action => action.actionType === ActionTypeEnum.SURVEILLANCE)

  const actions = useMemo(
    () =>
      getEnvActionsAndReportingsForTimeline(envActions, attachedReportings, detachedReportings, attachedReportingIds),
    [envActions, attachedReportings, detachedReportings, attachedReportingIds]
  )

  const sortedActions = useMemo(
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
    setCurrentActionIndex(newSurveillance.id)
  }, [
    envActions,
    isFirstSurveillanceAction,
    setCurrentActionIndex,
    setFieldValue,
    values?.endDateTimeUtc,
    values?.startDateTimeUtc
  ])

  const handleAddControlAction = useCallback(() => {
    const newControl = actionFactory({ actionType: ActionTypeEnum.CONTROL })
    setFieldValue('envActions', [newControl, ...(envActions || [])])
    setCurrentActionIndex(newControl.id)
  }, [envActions, setCurrentActionIndex, setFieldValue])

  const handleAddNoteAction = useCallback(() => {
    const newNote = actionFactory({ actionType: ActionTypeEnum.NOTE })
    setFieldValue('envActions', [newNote, ...(envActions || [])])
    setCurrentActionIndex(newNote.id)
  }, [envActions, setCurrentActionIndex, setFieldValue])

  const handleSelectAction = useCallback(
    id => {
      setCurrentActionIndex(actions && Object.keys(actions).find(key => key === String(id)))
    },
    [actions, setCurrentActionIndex]
  )

  const handleRemoveAction = useCallback(
    id => {
      if (!envActions) {
        return
      }

      const actionToDeleteIndex = envActions.findIndex(action => action.id === String(id))
      if (actionToDeleteIndex !== -1) {
        const actionsToUpdate = [...(envActions || [])]
        actionsToUpdate.splice(actionToDeleteIndex, 1)
        setFieldValue('envActions', actionsToUpdate)
      }
      setCurrentActionIndex(undefined)
    },
    [envActions, setCurrentActionIndex, setFieldValue]
  )

  const handleDuplicateAction = useCallback(
    id => {
      const envAction = envActions && envActions.find(action => action.id === id)

      if (envAction) {
        const duplicatedAction = actionFactory(envAction)
        setFieldValue('envActions', [duplicatedAction, ...(envActions || [])])

        setCurrentActionIndex(0)
      }
    },
    [envActions, setFieldValue, setCurrentActionIndex]
  )

  return (
    <FormWrapper>
      <TitleWrapper>
        <div>
          <Title>Actions réalisées en mission</Title>
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
        </div>
        <AttachReporting />
      </TitleWrapper>
      <ActionsTimeline>
        {sortedActions ? (
          sortedActions.map((action, index) => {
            const envActionsIndex = envActions?.findIndex(a => a.id === action.id)
            const envActionsErrors =
              errors?.envActions &&
              envActionsIndex !== undefined &&
              envActionsIndex >= 0 &&
              errors?.envActions[envActionsIndex]

            return (
              <ActionCards
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                action={action}
                duplicateAction={() => handleDuplicateAction(action.id)}
                hasError={!!envActionsErrors}
                removeAction={() => handleRemoveAction(action.id)}
                selectAction={() => handleSelectAction(action.id)}
                selected={String(action.id) === String(currentActionIndex)}
                setCurrentActionIndex={setCurrentActionIndex}
              />
            )
          })
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
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  padding-left: 32px;
  padding-top: 32px;
  padding-right: 48px;
  color: ${p => p.theme.color.slateGray};
`
const TitleWrapper = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
`
const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  color: ${p => p.theme.color.charcoal};
  display: inline-block;
  margin-right: 16px;
`

const ActionsTimeline = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
