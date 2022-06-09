import React from 'react'
import { Form } from 'rsuite'
import { Field } from 'formik'

import { FormikDatePicker } from '../../commonComponents/CustomFormikFields/FormikDatePicker';
import { missionNatureEnum, missionTypeEnum } from '../../../domain/entities/missions';
import { FormikRadioGroup } from '../../commonComponents/CustomFormikFields/FormikRadioGroup';

const placeholderDatePicker = '\xa0\xa0\xa0\xa0\xa0\xa0/\xa0\xa0\xa0\xa0\xa0\xa0/\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0:\xa0\xa0\xa0\xa0\xa0\xa0'

export const    GeneralInformationsForm = () => {
  return (
    <>
      <h3>Informations générales</h3>
      <Form.Group>
        <Form.ControlLabel htmlFor="inputStartDatetimeUtc">Date et heure du début de la mission : </Form.ControlLabel>
        <FormikDatePicker name="inputStartDatetimeUtc" placeholder={placeholderDatePicker} format="dd MMM yyyy, HH:mm" oneTap/>
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel htmlFor="inputEndDatetimeUtc">Date et heure de fin de la mission : </Form.ControlLabel>
        <FormikDatePicker name="inputEndDatetimeUtc" placeholder={placeholderDatePicker} format="dd MMM yyyy, HH:mm" oneTap/>
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel htmlFor="administration">Administration : </Form.ControlLabel>
        <Field name="administration" type="text"/>
        <Form.ControlLabel htmlFor="unit">Unité : </Form.ControlLabel>
        <Field name="unit" type="text"/>
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel htmlFor="moyens">Moyens : </Form.ControlLabel>
        <Field name="moyens" type="text"/>
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel htmlFor="missionType">Type de mission : </Form.ControlLabel>
        <FormikRadioGroup name="missionType" radioValues={missionTypeEnum} />
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel htmlFor="theme">Nature de mission : </Form.ControlLabel>
        <FormikRadioGroup name="theme" radioValues={missionNatureEnum} />
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel htmlFor="observations">Observations générales : </Form.ControlLabel>
        <Field name="observations" type="textarea"/>
      </Form.Group>
    </>
  )
}