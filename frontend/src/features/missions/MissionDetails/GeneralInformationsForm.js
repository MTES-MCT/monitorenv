import React from 'react'
import styled from 'styled-components';
import { Form } from 'rsuite'

import { missionNatureEnum, missionTypeEnum } from '../../../domain/entities/missions';

import { FormikDatePicker, placeholderDateTimePicker } from '../../commonComponents/CustomFormikFields/FormikDatePicker';
import { FormikRadioGroup } from '../../commonComponents/CustomFormikFields/FormikRadioGroup';
import { FormikTextarea } from '../../commonComponents/CustomFormikFields/FormikTextarea';
import { FormikInput } from '../../commonComponents/CustomFormikFields/FormikInput';

import { ControlResourcesSelector } from './ControlResourcesSelector';

import { COLORS } from '../../../constants/constants';
import { MissionZone } from './MissionZone';
import { FormikCheckboxGroup } from '../../commonComponents/CustomFormikFields/FormikCheckboxGroup';


export const GeneralInformationsForm = () => {
  
  return (
    <FormWrapper>
      <Title>Informations générales</Title>
      <Form.Group>
        <Form.ControlLabel htmlFor="inputStartDatetimeUtc">Début de mission</Form.ControlLabel>
        <FormikDatePicker name="inputStartDatetimeUtc" placeholder={placeholderDateTimePicker} format="dd MMM yyyy, HH:mm" oneTap/>
      </Form.Group>
      
      <Form.Group>
        <Form.ControlLabel htmlFor="inputEndDatetimeUtc">Fin de mission</Form.ControlLabel>
        <FormikDatePicker name="inputEndDatetimeUtc" placeholder={placeholderDateTimePicker} format="dd MMM yyyy, HH:mm" oneTap/>
      </Form.Group>
      
      <ControlResourcesSelector />
      
      <Form.Group>
        <Form.ControlLabel htmlFor="missionType">Type de mission</Form.ControlLabel>
        <FormikRadioGroup name="missionType" radioValues={missionTypeEnum} />
      </Form.Group>
      
      <Form.Group>
        <Form.ControlLabel htmlFor="missionNature">Nature de mission</Form.ControlLabel>
        <FormikCheckboxGroup name="missionNature" checkBoxValues={missionNatureEnum} />
      </Form.Group>

      <MissionZone name="geom" />
      <Form.Group>
        <Form.ControlLabel htmlFor="observations">Observations générales (éléments d&apos;ambiance, infos pour la relève...) </Form.ControlLabel>
        <FormikTextarea name="observations"/>
      </Form.Group>
      
      <Form.Group>
        <Form.ControlLabel htmlFor="open_by">Ouvert par</Form.ControlLabel>
        <FormikInput name="open_by"/>
        <Form.ControlLabel htmlFor="closed_by">Clôturé par</Form.ControlLabel>
        <FormikInput name="closed_by"/>
      </Form.Group>
    </FormWrapper>
  )
}

const FormWrapper = styled.div`
  padding: 32px;
  color: ${COLORS.slateGray}
`

const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  padding-bottom: 13px;
  color: ${COLORS.charcoal}
`
