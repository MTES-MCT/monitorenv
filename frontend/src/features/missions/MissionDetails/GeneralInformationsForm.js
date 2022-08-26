import React from 'react'
import styled from 'styled-components'
import { Form } from 'rsuite'
import { FieldArray } from 'formik'

import { missionNatureEnum, missionTypeEnum } from '../../../domain/entities/missions'

import { FormikDatePicker, placeholderDateTimePicker } from '../../../uiMonitor/CustomFormikFields/FormikDatePicker'
import { FormikRadioGroup } from '../../../uiMonitor/CustomFormikFields/FormikRadioGroup'
import { FormikTextarea } from '../../../uiMonitor/CustomFormikFields/FormikTextarea'
import { FormikInput } from '../../../uiMonitor/CustomFormikFields/FormikInput'
import { FormikCheckboxGroup } from '../../../uiMonitor/CustomFormikFields/FormikCheckboxGroup'

import { MissionZones } from './MissionZones'
import { ResourceUnitsForm } from './ResourceUnitsForm'

import { COLORS } from '../../../constants/constants'

export const GeneralInformationsForm = () => {
  
  return (
    <>
      <Title>Informations générales</Title>
      <Form.Group>
        <Form.ControlLabel htmlFor="inputStartDatetimeUtc">Début de mission</Form.ControlLabel>
        <FormikDatePicker name="inputStartDatetimeUtc" placeholder={placeholderDateTimePicker} format="dd MMM yyyy, HH:mm" oneTap/>
      </Form.Group>
      
      <Form.Group>
        <Form.ControlLabel htmlFor="inputEndDatetimeUtc">Fin de mission</Form.ControlLabel>
        <FormikDatePicker name="inputEndDatetimeUtc" placeholder={placeholderDateTimePicker} format="dd MMM yyyy, HH:mm" oneTap/>
      </Form.Group>
      
      <Form.Group>
        <Form.ControlLabel htmlFor="missionType">Type de mission</Form.ControlLabel>
        <TypeMissionRadioGroup name="missionType" radioValues={missionTypeEnum} />
      </Form.Group>
      
      <Form.Group>
        <Form.ControlLabel htmlFor="missionNature">Nature de mission</Form.ControlLabel>
        <NatureMissionCheckboxGroup inline name="missionNature" checkBoxValues={missionNatureEnum} />
      </Form.Group>
      <Form.Group>
        <FieldArray 
          name={`resourceUnits`} 
          render={(props)=>(<ResourceUnitsForm 
          {...props} 
          />
        )} />
      </Form.Group>

      <MissionZones name="geom" />
      <Form.Group>
        <Form.ControlLabel htmlFor="observations">Observations générales </Form.ControlLabel>
        <InputObservations  name="observations"/>
      </Form.Group>
      
      <Form.Group>
          <ColWrapper>
              <Form.ControlLabel htmlFor="open_by">Ouvert par</Form.ControlLabel>
              <FormikInput  name="open_by"/>
          </ColWrapper>
          <ColWrapper>
              <Form.ControlLabel htmlFor="closed_by">Clôturé par</Form.ControlLabel>
              <FormikInput  name="closed_by"/>
          </ColWrapper>
      </Form.Group>
    </>
  )
}
const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  padding-bottom: 13px;
  color: ${COLORS.charcoal}
`
const ColWrapper = styled.div`
  width: 200px;
  display: inline-block;
  :not(:last-child){
    margin-right: 16px;
  }
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