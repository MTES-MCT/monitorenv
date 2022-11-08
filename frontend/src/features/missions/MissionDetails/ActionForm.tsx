import { useField } from 'formik'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { actionTypeEnum } from '../../../domain/entities/missions'
import { ControlForm } from './ControlForm'
import { NoteForm } from './NoteForm'
import { SurveillanceForm } from './SurveillanceForm'

export function ActionForm({ currentActionIndex, remove, setCurrentActionIndex }) {
  const [actionTypeField] = useField(`envActions.${currentActionIndex}.actionType`)

  if (currentActionIndex === null) {
    return <NoSelectedAction>Ajouter ou sélectionner une action</NoSelectedAction>
  }
  switch (actionTypeField.value) {
    case actionTypeEnum.CONTROL.code:
      return (
        <FormWrapper>
          <ControlForm
            currentActionIndex={currentActionIndex}
            remove={remove}
            setCurrentActionIndex={setCurrentActionIndex}
          />
        </FormWrapper>
      )
    case actionTypeEnum.SURVEILLANCE.code:
      return (
        <FormWrapper>
          <SurveillanceForm
            currentActionIndex={currentActionIndex}
            remove={remove}
            setCurrentActionIndex={setCurrentActionIndex}
          />
        </FormWrapper>
      )
    case actionTypeEnum.NOTE.code:
      return (
        <FormWrapper>
          <NoteForm
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
