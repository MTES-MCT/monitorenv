import { isBefore } from 'date-fns'
import { useMemo } from 'react'
import { Dropdown } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { ActionTypeEnum, EnvAction } from '../../../domain/entities/missions'
import { ReactComponent as ControlSVG } from '../../../uiMonitor/icons/Control.svg'
import { ReactComponent as NoteSVG } from '../../../uiMonitor/icons/Note_libre.svg'
import { ReactComponent as SurveillanceSVG } from '../../../uiMonitor/icons/Observation.svg'
import { ReactComponent as PlusSVG } from '../../../uiMonitor/icons/Plus.svg'
import { actionFactory } from '../Missions.helpers'
import { ActionCard } from './ActionCard'

export function ActionsForm({ currentActionIndex, form, remove, setCurrentActionIndex, unshift }) {
  const envActions = form?.values?.envActions as EnvAction[] | undefined
  const isFirstSurveillanceAction = !envActions?.find(action => action.actionType === ActionTypeEnum.SURVEILLANCE)
  const isClosed = form?.values?.isClosed
  const currentActionId = envActions && envActions[currentActionIndex]?.id

  const sortedEnvActions = useMemo(
    () =>
      envActions &&
      [...envActions].sort((a, b) => {
        if (a.actionStartDateTimeUtc === undefined) {
          return -1
        }
        if (b.actionStartDateTimeUtc === undefined) {
          return +1
        }

        return a.actionStartDateTimeUtc &&
          b.actionStartDateTimeUtc &&
          isBefore(new Date(a.actionStartDateTimeUtc), new Date(b.actionStartDateTimeUtc))
          ? +1
          : -1
      }),
    [envActions]
  )
  const handleAddSurveillanceAction = () => {
    unshift(
      actionFactory({
        actionType: ActionTypeEnum.SURVEILLANCE,
        durationMatchesMission: isFirstSurveillanceAction,
        ...(isFirstSurveillanceAction && {
          actionEndDateTimeUtc: form?.values?.endDateTimeUtc,
          actionStartDateTimeUtc: form?.values?.startDateTimeUtc
        })
      })
    )
    if (envActions?.length === 0) {
      setCurrentActionIndex(0)
    }
  }

  const handleAddControlAction = () => {
    unshift(actionFactory({ actionType: ActionTypeEnum.CONTROL }))
    if (envActions?.length === 0) {
      setCurrentActionIndex(0)
    }
  }
  const handleAddNoteAction = () => {
    unshift(actionFactory({ actionType: ActionTypeEnum.NOTE }))
    if (envActions?.length === 0) {
      setCurrentActionIndex(0)
    }
  }
  const handleSelectAction = id => () => setCurrentActionIndex(envActions && envActions.findIndex(a => a.id === id))
  const handleRemoveAction = id => e => {
    e.stopPropagation()
    remove(envActions && envActions.findIndex(a => a.id === id))
    setCurrentActionIndex(undefined)
  }

  const handleDuplicateAction = id => () => {
    const envAction = envActions && envActions.find(a => a.id === id)
    if (envAction) {
      unshift(actionFactory(envAction))
      setCurrentActionIndex(0)
    }
  }

  return (
    <FormWrapper>
      <TitleWrapper>
        <Title>Actions réalisées en mission</Title>
        {!isClosed && (
          <Dropdown appearance="primary" icon={<PlusSVG className="rs-icon" />} noCaret title="Ajouter">
            <Dropdown.Item icon={<ControlSVG />} onClick={handleAddControlAction}>
              Ajouter des contrôles
            </Dropdown.Item>
            <Dropdown.Item
              data-cy="add-surveillance-action"
              icon={<SurveillanceSVG />}
              onClick={handleAddSurveillanceAction}
            >
              Ajouter une surveillance
            </Dropdown.Item>
            <Dropdown.Item icon={<NoteSVG />} onClick={handleAddNoteAction}>
              Ajouter une note libre
            </Dropdown.Item>
          </Dropdown>
        )}
      </TitleWrapper>
      <ActionsTimeline>
        {sortedEnvActions && sortedEnvActions.length > 0 ? (
          sortedEnvActions.map(action => {
            const index = envActions?.findIndex(a => a.id === action.id)
            const errors =
              form?.errors?.envActions && index !== undefined && index >= 0 && form?.errors?.envActions[index]

            return (
              <ActionCard
                key={action.id}
                action={action}
                duplicateAction={handleDuplicateAction(action.id)}
                hasError={!!errors}
                readOnly={isClosed}
                removeAction={handleRemoveAction(action.id)}
                selectAction={handleSelectAction(action.id)}
                selected={action.id === currentActionId}
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
  color: ${COLORS.slateGray};
`
const TitleWrapper = styled.div`
  margin-bottom: 30px;
`
const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  color: ${COLORS.charcoal};
  display: inline-block;
  margin-right: 16px;
`

const ActionsTimeline = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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
