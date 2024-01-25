import { useField } from 'formik'
import { useCallback } from 'react'
import styled from 'styled-components'

import { ControlForm } from './ControlForm/ControlForm'
import { NoteForm } from './NoteForm'
import { ReportingForm } from './ReportingForm'
import { SurveillanceForm } from './SurveillanceForm'
import { ActionTypeEnum, type EnvAction } from '../../../../domain/entities/missions'

import type { Reporting } from '../../../../domain/entities/reporting'

type ActionFormProps = {
  currentActionIndex: string | undefined
  setCurrentActionIndex: (index: number | undefined) => void
}
export function ActionForm({ currentActionIndex, setCurrentActionIndex }: ActionFormProps) {
  const [attachedReportingsField] = useField<Reporting[]>('attachedReportings')
  const reportingActionIndex = (attachedReportingsField.value ?? []).findIndex(
    reporting => String(reporting.id) === currentActionIndex
  )
  const [reportingField] = useField<Reporting>(`attachedReportings.${reportingActionIndex}`)

  const [envActionsField, , envActionsHelper] = useField<EnvAction[]>('envActions')
  const envActionIndex = (envActionsField.value ?? []).findIndex(envAction => envAction.id === currentActionIndex)
  const [actionTypeField] = useField<ActionTypeEnum>(`envActions.${envActionIndex}.actionType`)
  const [actionIdField] = useField<EnvAction['id']>(`envActions.${envActionIndex}.id`)

  const removeAction = useCallback(() => {
    const actionsToUpdate = [...(envActionsField.value || [])]
    actionsToUpdate.splice(envActionIndex, 1)
    envActionsHelper.setValue(actionsToUpdate)

    setCurrentActionIndex(undefined)
  }, [envActionIndex, envActionsField, envActionsHelper, setCurrentActionIndex])

  if (currentActionIndex === undefined) {
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
          setCurrentActionIndex={setCurrentActionIndex}
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
              currentActionIndex={currentActionIndex}
              removeControlAction={removeAction}
              setCurrentActionIndex={setCurrentActionIndex}
            />
          </FormWrapper>
        )
      case ActionTypeEnum.SURVEILLANCE:
        return (
          <FormWrapper>
            <SurveillanceForm
              key={actionIdField.value}
              currentActionIndex={currentActionIndex}
              remove={removeAction}
              setCurrentActionIndex={setCurrentActionIndex}
            />
          </FormWrapper>
        )
      case ActionTypeEnum.NOTE:
        return (
          <FormWrapper>
            <NoteForm
              key={actionIdField.value}
              currentActionIndex={currentActionIndex}
              remove={removeAction}
              setCurrentActionIndex={setCurrentActionIndex}
            />
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
