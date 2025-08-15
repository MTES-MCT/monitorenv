import { useField } from 'formik'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { ControlForm } from './ControlForm'
import { NoteForm } from './NoteForm'
import { ReportingForm } from './ReportingForm'
import { SurveillanceForm } from './SurveillanceForm'
import { ActionTypeEnum, type EnvAction } from '../../../../../domain/entities/missions'

import type { Reporting } from '../../../../../domain/entities/reporting'

type ActionFormProps = {
  currentActionId: string | undefined
  setCurrentActionId: (actionId: string | undefined) => void
}
export function ActionForm({ currentActionId, setCurrentActionId }: ActionFormProps) {
  const [attachedReportingsField] = useField<Reporting[]>('attachedReportings')
  const reportingActionIndex = useMemo(
    () => (attachedReportingsField.value ?? []).findIndex(reporting => reporting.id === currentActionId),
    [attachedReportingsField.value, currentActionId]
  )

  const [envActionsField, , envActionsHelper] = useField<EnvAction[]>('envActions')
  const envActionIndex = useMemo(
    () => (envActionsField.value ?? []).findIndex(envAction => envAction.id === currentActionId),
    [envActionsField.value, currentActionId]
  )
  const currentEnvAction = useMemo(() => envActionsField.value[envActionIndex], [envActionsField.value, envActionIndex])

  const removeAction = useCallback(() => {
    const actionsToUpdate = [...(envActionsField.value || [])]
    actionsToUpdate.splice(envActionIndex, 1)
    envActionsHelper.setValue(actionsToUpdate)

    setCurrentActionId(undefined)
  }, [envActionIndex, envActionsField.value, envActionsHelper, setCurrentActionId])

  if (currentActionId === undefined) {
    return (
      <FormWrapper>
        <NoSelectedAction>Ajouter ou sélectionner une action</NoSelectedAction>
      </FormWrapper>
    )
  }

  if (reportingActionIndex !== -1) {
    return (
      <ReportingFormWrapper>
        <ReportingForm
          key={attachedReportingsField.value[reportingActionIndex]?.id}
          reportingActionIndex={reportingActionIndex}
          setCurrentActionId={setCurrentActionId}
        />
      </ReportingFormWrapper>
    )
  }

  if (currentEnvAction && envActionIndex !== -1) {
    switch (currentEnvAction.actionType) {
      case ActionTypeEnum.CONTROL:
        return (
          <FormWrapper>
            <ControlForm
              key={currentEnvAction?.id}
              currentActionId={currentActionId}
              removeControlAction={removeAction}
            />
          </FormWrapper>
        )
      case ActionTypeEnum.SURVEILLANCE:
        return (
          <FormWrapper>
            <SurveillanceForm key={currentEnvAction.id} currentActionId={currentActionId} onRemove={removeAction} />
          </FormWrapper>
        )
      case ActionTypeEnum.NOTE:
        return (
          <FormWrapper>
            <NoteForm key={currentEnvAction.id} currentActionId={currentActionId} remove={removeAction} />
          </FormWrapper>
        )

      default:
        break
    }
  }

  return (
    <FormWrapper>
      <NoSelectedAction>Erreur. Recharger la page.</NoSelectedAction>
    </FormWrapper>
  )
}

const FormWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px 19px 32px 32px;
  color: ${p => p.theme.color.slateGray};
  background-color: ${p => p.theme.color.gainsboro};
  overflow-y: auto;
`
const ReportingFormWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px 80px 40px 80px;
  background-color: ${p => p.theme.color.white};
  overflow-y: auto;
`
const NoSelectedAction = styled.div`
  text-align: center;
`
