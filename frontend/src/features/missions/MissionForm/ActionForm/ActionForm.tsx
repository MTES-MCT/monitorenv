import { useField } from 'formik'
import styled from 'styled-components'

import { ControlForm } from './ControlForm/ControlForm'
import { NoteForm } from './NoteForm'
import { SurveillanceForm } from './SurveillanceForm'
import { COLORS } from '../../../../constants/constants'
import { ActionTypeEnum, EnvAction, Mission } from '../../../../domain/entities/missions'

type ActionFormProps = {
  currentActionIndex: number | undefined
  remove: (index: number) => any
  setCurrentActionIndex: (index: number | undefined) => void
}
export function ActionForm({ currentActionIndex, remove, setCurrentActionIndex }: ActionFormProps) {
  const [actionTypeField] = useField<ActionTypeEnum>(`envActions.${currentActionIndex}.actionType`)
  const [actionIdField] = useField<EnvAction['id']>(`envActions.${currentActionIndex}.id`)
  const [isClosedField] = useField<Mission['isClosed']>(`isClosed`)

  if (currentActionIndex === undefined) {
    return (
      <FormWrapper>
        <NoSelectedAction>Ajouter ou sélectionner une action</NoSelectedAction>
      </FormWrapper>
    )
  }
  switch (actionTypeField.value) {
    case ActionTypeEnum.CONTROL:
      return (
        <FormWrapper>
          <ControlForm
            key={actionIdField.value}
            currentActionIndex={currentActionIndex}
            readOnly={isClosedField.value}
            removeControlAction={remove}
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
            readOnly={isClosedField.value}
            remove={remove}
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
            remove={remove}
            setCurrentActionIndex={setCurrentActionIndex}
          />
        </FormWrapper>
      )

    default:
      break
  }

  return (
    <FormWrapper>
      <NoSelectedAction>Erreur. Recharger la page.</NoSelectedAction>
    </FormWrapper>
  )
}

const FormWrapper = styled.div`
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  padding-left: 32px;
  padding-top: 32px;
  padding-right: 19px;
  color: ${COLORS.slateGray};
`

const NoSelectedAction = styled.div`
  text-align: center;
`
