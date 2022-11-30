/* eslint-disable react/jsx-props-no-spreading */
import { FieldArray } from 'formik'
import { Form } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { missionNatureEnum, missionTypeEnum } from '../../../domain/entities/missions'
import { FormikCheckboxGroup } from '../../../uiMonitor/CustomFormikFields/FormikCheckboxGroup'
import { FormikDatePicker, placeholderDateTimePicker } from '../../../uiMonitor/CustomFormikFields/FormikDatePicker'
import { FormikInput } from '../../../uiMonitor/CustomFormikFields/FormikInput'
import { FormikRadioGroup } from '../../../uiMonitor/CustomFormikFields/FormikRadioGroup'
import { FormikTextarea } from '../../../uiMonitor/CustomFormikFields/FormikTextarea'
import { MissionZones } from './MissionZones'
import { ResourceUnitsForm } from './ResourceUnitsForm'

export function GeneralInformationsForm() {
  return (
    <>
      <Title>Informations générales</Title>
      <FlexFormGroup>
        <ColWrapper>
          <Form.ControlLabel htmlFor="inputStartDateTimeUtc">Début de mission</Form.ControlLabel>
          <FormikDatePicker
            cleanable={false}
            format="dd MMM yyyy, HH:mm"
            name="inputStartDateTimeUtc"
            oneTap
            placeholder={placeholderDateTimePicker}
            size="sm"
          />
        </ColWrapper>
        <ColWrapper>
          <Form.ControlLabel htmlFor="inputEndDateTimeUtc">Fin de mission</Form.ControlLabel>
          <FormikDatePicker
            format="dd MMM yyyy, HH:mm"
            name="inputEndDateTimeUtc"
            oneTap
            placeholder={placeholderDateTimePicker}
            size="sm"
          />
        </ColWrapper>
      </FlexFormGroup>

      <Form.Group>
        <SubGroup>
          <Form.ControlLabel htmlFor="missionType">Type de mission</Form.ControlLabel>
          <TypeMissionRadioGroup name="missionType" radioValues={missionTypeEnum} />
        </SubGroup>
        <SubGroup>
          <Form.ControlLabel htmlFor="missionNature">Intentions principales de mission</Form.ControlLabel>
          <NatureMissionCheckboxGroup checkBoxValues={missionNatureEnum} inline name="missionNature" size="sm" />
        </SubGroup>
      </Form.Group>
      <Form.Group>
        <FieldArray name="resourceUnits" render={props => <ResourceUnitsForm {...props} />} />
      </Form.Group>

      <MissionZones name="geom" />
      <Form.Group>
        <Form.ControlLabel htmlFor="observationsCacem">CACEM : orientations, observations </Form.ControlLabel>
        <InputObservations name="observationsCacem" />
        <Form.ControlLabel htmlFor="observationsCnsp">CNSP : orientations, observations </Form.ControlLabel>
        <InputObservations name="observationsCnsp" />
      </Form.Group>

      <Form.Group>
        <NarrowColumn>
          <Form.ControlLabel htmlFor="openBy">Ouvert par</Form.ControlLabel>
          <FormikInput name="openBy" size="sm" />
        </NarrowColumn>
        <NarrowColumn>
          <Form.ControlLabel htmlFor="closedBy">Clôturé par</Form.ControlLabel>
          <FormikInput name="closedBy" size="sm" />
        </NarrowColumn>
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
const SubGroup = styled.div`
  magin-bottom: 16px;
`

const TypeMissionRadioGroup = styled(FormikRadioGroup)`
  margin-left: -20px;
`

const NatureMissionCheckboxGroup = styled(FormikCheckboxGroup)``

const InputObservations = styled(FormikTextarea)`
  max-width: 416px;
`
