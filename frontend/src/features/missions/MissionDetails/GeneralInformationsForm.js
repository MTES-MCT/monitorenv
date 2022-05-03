import React from 'react'
import { Form } from 'rsuite'
import { Field } from 'formik'

import { FormikDatePicker } from '../../commonComponents/FormikDatePicker';

export const    GeneralInformationsForm = () => {
  return (
    <>
      <h3>Informations générales</h3>
      <Form.Group>
        <Form.ControlLabel htmlFor="inputStartDatetimeUtc">Date et heure du début de la mission : </Form.ControlLabel>
        <FormikDatePicker name="inputStartDatetimeUtc" placeholder={'Début'} oneTap/>
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel htmlFor="inputEndDatetimeUtc">Date et heure de fin de la mission : </Form.ControlLabel>
        <FormikDatePicker name="inputEndDatetimeUtc" placeholder={'Début'} oneTap/>
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel htmlFor="unit">Unité : </Form.ControlLabel>
        <Field name="unit"type="text"/>
        <Form.ControlLabel htmlFor="administration">Administration : </Form.ControlLabel>
        <Field name="administration"type="text"/>
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel htmlFor="missionType">Type Opération : </Form.ControlLabel>
        <Field name="missionType"type="text"/>
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel htmlFor="theme">theme : </Form.ControlLabel>
        <Field name="theme"type="text"/>
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel htmlFor="observations">Observations générales : </Form.ControlLabel>
        <Field name="observations"type="textarea"/>
      </Form.Group>
    </>
  )
}