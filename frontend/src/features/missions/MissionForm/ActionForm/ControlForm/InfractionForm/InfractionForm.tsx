import { useField } from 'formik'
import { Form, Button, ButtonToolbar } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../../../constants/constants'
import { infractionTypeEnum, formalNoticeEnum, actionTargetTypeEnum } from '../../../../../../domain/entities/missions'
import { FormikCheckbox } from '../../../../../../uiMonitor/CustomFormikFields/FormikCheckbox'
import { FormikInput } from '../../../../../../uiMonitor/CustomFormikFields/FormikInput'
import { FormikRadioGroup } from '../../../../../../uiMonitor/CustomFormikFields/FormikRadioGroup'
import { FormikTextarea } from '../../../../../../uiMonitor/CustomFormikFields/FormikTextarea'
import { InfractionFormHeaderCompany } from './InfractionFormHeaderCompany'
import { InfractionFormHeaderVehicle } from './InfractionFormHeaderVehicle'
import { NatinfSelector } from './NatinfSelector'
import { RelevantCourtSelector } from './RelevantCourtSelector'

export function InfractionForm({ currentActionIndex, infractionPath, removeInfraction, validateInfraction }) {
  const [actionTargetField] = useField(`envActions.${currentActionIndex}.actionTargetType`)

  return (
    <FormWrapper data-cy="infraction-form">
      {actionTargetField.value === actionTargetTypeEnum.VEHICLE.code && (
        <InfractionFormHeaderVehicle currentActionIndex={currentActionIndex} infractionPath={infractionPath} />
      )}

      {actionTargetField.value === actionTargetTypeEnum.COMPANY.code && (
        <InfractionFormHeaderCompany infractionPath={infractionPath} />
      )}

      <Form.Group>
        <Form.ControlLabel htmlFor={`${infractionPath}.controlledPersonIdentity`}>
          Identité de la personne controlée
        </Form.ControlLabel>
        <FormikInput name={`${infractionPath}.controlledPersonIdentity`} size="sm" />
      </Form.Group>

      <SubGroup>
        <Form.ControlLabel htmlFor={`${infractionPath}.infractionType`}>Type d&apos;infraction</Form.ControlLabel>
        <FormikRadioGroup name={`${infractionPath}.infractionType`} radioValues={infractionTypeEnum} />
      </SubGroup>

      <SubGroup>
        <Form.ControlLabel htmlFor={`${infractionPath}.formalNotice`}>Mise en demeure</Form.ControlLabel>
        <FormikRadioGroup name={`${infractionPath}.formalNotice`} radioValues={formalNoticeEnum} />
      </SubGroup>

      <FormGroupFixedHeight>
        <NatinfSelector infractionPath={infractionPath} />
      </FormGroupFixedHeight>

      <Form.Group>
        <FormColumn>
          <RelevantCourtSelector infractionPath={infractionPath} />
        </FormColumn>

        <FormColumnWithCheckbox>
          <FormikCheckbox inline label="A traiter" name={`${infractionPath}.toProcess`} />
        </FormColumnWithCheckbox>
      </Form.Group>

      <Form.Group>
        <Form.ControlLabel htmlFor="observations">Observations</Form.ControlLabel>
        <FormikTextarea name={`${infractionPath}.observations`} />
      </Form.Group>
      <ButtonToolbarRight>
        <Button onClick={removeInfraction}>Supprimer l&apos;infraction</Button>
        <Button appearance="primary" data-cy="infraction-form-validate" onClick={validateInfraction}>
          Valider l&apos;infraction
        </Button>
      </ButtonToolbarRight>
    </FormWrapper>
  )
}

const FormWrapper = styled.div`
  background: ${COLORS.white};
  padding: 32px;
`
const FormGroupFixedHeight = styled(Form.Group)`
  haight: 58px;
`

const FormColumn = styled.div`
  display: inline-block;
`
const FormColumnWithCheckbox = styled.div`
  display: inline-block;
  vertical-align: top;
  padding-top: 16px;
`
const ButtonToolbarRight = styled(ButtonToolbar)`
  display: flex;
  justify-content: flex-end;
`
const SubGroup = styled.div`
  margin-bottom: 16px;
`
