/* eslint-disable react/jsx-props-no-spreading */
import { FieldArray } from 'formik'
import { Form } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { InteractionListener } from '../../../domain/entities/map/constants'
import { missionNatureEnum, missionTypeEnum } from '../../../domain/entities/missions'
import { FormikCheckboxGroup } from '../../../uiMonitor/CustomFormikFields/FormikCheckboxGroup'
import { FormikDatePicker } from '../../../uiMonitor/CustomFormikFields/FormikDatePicker'
import { FormikErrorWrapper } from '../../../uiMonitor/CustomFormikFields/FormikErrorWrapper'
import { FormikInput } from '../../../uiMonitor/CustomFormikFields/FormikInput'
import { FormikRadioGroup } from '../../../uiMonitor/CustomFormikFields/FormikRadioGroup'
import { FormikTextarea } from '../../../uiMonitor/CustomFormikFields/FormikTextarea'
import { MultiZonePicker } from '../MultiZonePicker'
import { ControlUnitsForm } from './ControlUnitsForm'

export function GeneralInformationsForm() {
  return (
    <>
      <Title>Informations générales</Title>
      <FlexFormGroup>
        <ColWrapper>
          <FormikErrorWrapper name="startDateTimeUtc">
            <FormikDatePicker isCompact label="Début de mission" name="startDateTimeUtc" withTime />
          </FormikErrorWrapper>
        </ColWrapper>
        <ColWrapper>
          <FormikErrorWrapper name="endDateTimeUtc">
            <FormikDatePicker isCompact label="Fin de mission" name="endDateTimeUtc" withTime />
          </FormikErrorWrapper>
        </ColWrapper>
      </FlexFormGroup>

      <Form.Group>
        <FieldWrapper>
          <FormikErrorWrapper name="missionType">
            <Form.ControlLabel htmlFor="missionType">Type de mission</Form.ControlLabel>
            <TypeMissionRadioGroup name="missionType" radioValues={missionTypeEnum} />
          </FormikErrorWrapper>
        </FieldWrapper>
        <FieldWrapper>
          <FormikErrorWrapper name="missionNature">
            <Form.ControlLabel htmlFor="missionNature">Intentions principales de mission</Form.ControlLabel>
            <NatureMissionCheckboxGroup checkBoxValues={missionNatureEnum} inline name="missionNature" size="sm" />
          </FormikErrorWrapper>
        </FieldWrapper>
      </Form.Group>
      <Form.Group>
        <FieldArray name="controlUnits" render={props => <ControlUnitsForm {...props} />} />
      </Form.Group>
      <MultiZonePicker
        addButtonLabel="Ajouter une zone de mission"
        interactionListener={InteractionListener.MISSION_ZONE}
        label="Localisations :"
        name="geom"
      />
      <Form.Group>
        <Form.ControlLabel htmlFor="observationsCacem">CACEM : orientations, observations </Form.ControlLabel>
        <InputObservations name="observationsCacem" />
        <Form.ControlLabel htmlFor="observationsCnsp">CNSP : orientations, observations </Form.ControlLabel>
        <InputObservations name="observationsCnsp" />
        <SubGroup>
          <NarrowColumn>
            <Form.ControlLabel htmlFor="openBy">Ouvert par</Form.ControlLabel>
            <FormikInput name="openBy" size="sm" />
          </NarrowColumn>
          <NarrowColumn>
            <Form.ControlLabel htmlFor="closedBy">Clôturé par</Form.ControlLabel>
            <FormikInput name="closedBy" size="sm" />
          </NarrowColumn>
        </SubGroup>
      </Form.Group>
    </>
  )
}
const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  padding-bottom: 13px;
  color: ${COLORS.charcoal};
`
const FlexFormGroup = styled(Form.Group)`
  display: flex;
`
const ColWrapper = styled.div`
  width: 200px;
  height: 54px;
  display: inline-block;
  :not(:last-child) {
    margin-right: 16px;
  }
`

const NarrowColumn = styled.div`
  width: 120px;
  display: inline-block;
  :not(:last-child) {
    margin-right: 16px;
  }
`
const FieldWrapper = styled.div``
const SubGroup = styled.div`
  margin-bottom: 16px;
  display: flex;
`

const TypeMissionRadioGroup = styled(FormikRadioGroup)`
  margin-left: -20px;
`

const NatureMissionCheckboxGroup = styled(FormikCheckboxGroup)`
  margin-left: -20px;
`

const InputObservations = styled(FormikTextarea)`
  max-width: 416px;
`
