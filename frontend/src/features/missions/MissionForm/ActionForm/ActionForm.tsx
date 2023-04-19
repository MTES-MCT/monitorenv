import { useField } from 'formik'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { actionTypeEnum } from '../../../../domain/entities/missions'
import { ControlForm } from './ControlForm/ControlForm'
import { NoteForm } from './NoteForm'
import { SurveillanceForm } from './SurveillanceForm'

type ActionFormProps = {
  currentActionIndex: number | undefined
  remove: (number) => any
  setCurrentActionIndex: (number) => void
}
export function ActionForm({ currentActionIndex, remove, setCurrentActionIndex }: ActionFormProps) {
  const [actionTypeField] = useField(`envActions.${currentActionIndex}.actionType`)
  const [actionIdField] = useField(`envActions.${currentActionIndex}.id`)
  const [isClosedField] = useField(`isClosed`)

  if (currentActionIndex === undefined) {
    return (
      <FormWrapper>
        <NoSelectedAction>Ajouter ou sélectionner une action</NoSelectedAction>
      </FormWrapper>
    )
  }
  switch (actionTypeField.value) {
    case actionTypeEnum.CONTROL.code:
      return (
        <FormWrapper>
          <ControlForm
            key={actionIdField.value}
            currentActionIndex={currentActionIndex}
            readOnly={isClosedField.value}
            remove={remove}
            setCurrentActionIndex={setCurrentActionIndex}
          />
        </FormWrapper>
      )
    case actionTypeEnum.SURVEILLANCE.code:
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
    case actionTypeEnum.NOTE.code:
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
