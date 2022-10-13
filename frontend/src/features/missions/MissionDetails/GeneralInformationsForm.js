import { FieldArray } from 'formik'
import React from 'react'
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
      <Form.Group>
        <FixedFormGroup>
          <Form.ControlLabel htmlFor="inputStartDatetimeUtc">Début de mission</Form.ControlLabel>
          <FormikDatePicker
            format="dd MMM yyyy, HH:mm"
            name="inputStartDatetimeUtc"
            oneTap
            placeholder={placeholderDateTimePicker}
          />
        </FixedFormGroup>

        <FixedFormGroup>
          <Form.ControlLabel htmlFor="inputEndDatetimeUtc">Fin de mission</Form.ControlLabel>
          <FormikDatePicker
            format="dd MMM yyyy, HH:mm"
            name="inputEndDatetimeUtc"
            oneTap
            placeholder={placeholderDateTimePicker}
          />
        </FixedFormGroup>
      </Form.Group>

      <Form.Group>
        <SubGroup>
          <Form.ControlLabel htmlFor="missionType">Type de mission</Form.ControlLabel>
          <TypeMissionRadioGroup name="missionType" radioValues={missionTypeEnum} />
        </SubGroup>
        <SubGroup>
          <Form.ControlLabel htmlFor="missionNature">Nature de mission</Form.ControlLabel>
          <NatureMissionCheckboxGroup checkBoxValues={missionNatureEnum} inline name="missionNature" />
        </SubGroup>
      </Form.Group>
      <Form.Group>
        <FieldArray name="resourceUnits" render={props => <ResourceUnitsForm {...props} />} />
      </Form.Group>

      <MissionZones name="geom" />
      <Form.Group>
        <Form.ControlLabel htmlFor="observations">Observations générales </Form.ControlLabel>
        <InputObservations name="observations" />
      </Form.Group>

      <Form.Group>
        <ColWrapper>
          <Form.ControlLabel htmlFor="open_by">Ouvert par</Form.ControlLabel>
          <FormikInput name="open_by" />
        </ColWrapper>
        <ColWrapper>
          <Form.ControlLabel htmlFor="closed_by">Clôturé par</Form.ControlLabel>
          <FormikInput name="closed_by" />
        </ColWrapper>
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

const ColWrapper = styled.div`
  width: 200px;
  display: inline-block;
  :not(:last-child) {
    margin-right: 16px;
  }
`

const FixedFormGroup = styled.div`
  height: 58px;
  margin-bottom: 16px;
`
const SubGroup = styled.div`
  magin-bottom: 16px;
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
