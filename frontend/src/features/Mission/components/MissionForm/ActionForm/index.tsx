import { useField } from 'formik'
import { useCallback } from 'react'
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
  const reportingActionIndex = (attachedReportingsField.value ?? []).findIndex(
    reporting => reporting.id === currentActionId
  )

  const [reportingField] = useField<Reporting>(`attachedReportings.${reportingActionIndex}`)

  const [envActionsField, , envActionsHelper] = useField<EnvAction[]>('envActions')
  const envActionIndex = (envActionsField.value ?? []).findIndex(envAction => envAction.id === currentActionId)
  const [actionTypeField] = useField<ActionTypeEnum>(`envActions.${envActionIndex}.actionType`)
  const [actionIdField] = useField<EnvAction['id']>(`envActions.${envActionIndex}.id`)

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
          key={reportingField.value.id}
          reportingActionIndex={reportingActionIndex}
          setCurrentActionId={setCurrentActionId}
        />
      </ReportingFormWrapper>
    )
  }

  if (envActionIndex !== -1) {
    switch (actionTypeField.value) {
      case ActionTypeEnum.CONTROL:
        return (
          <FormWrapper>
            <ControlForm
              key={actionIdField.value}
              currentActionId={currentActionId}
              removeControlAction={removeAction}
            />
          </FormWrapper>
        )
      case ActionTypeEnum.SURVEILLANCE:
        return (
          <FormWrapper>
            <SurveillanceForm key={actionIdField.value} currentActionId={currentActionId} remove={removeAction} />
          </FormWrapper>
        )
      case ActionTypeEnum.NOTE:
        return (
          <FormWrapper>
            <NoteForm key={actionIdField.value} currentActionId={currentActionId} remove={removeAction} />
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
