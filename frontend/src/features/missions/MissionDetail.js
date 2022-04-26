import React, {useRef} from 'react'
import { Formik, Field, useField } from 'formik';
import { DatePicker, Form } from 'rsuite'
import { useGetMissionsQuery, useUpdateMissionMutation } from '../../api/missionsAPI'
import { PrimaryButton } from '../commonStyles/Buttons.style';
import { parseISO } from 'rsuite/esm/utils/dateUtils';
import styled from 'styled-components';
 

const FormikDatePicker = ({ name, ...props }) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;

  const setValueAsString = (date) => {
    const dateAsString = date ? date.toISOString() : null
    setValue(dateAsString)
  }
  const valueAsDate = value ? parseISO(value) : null
  const datepickerRef = useRef()
  const container = document.getElementById('new-window-container')
  console.log(container)
  console.log('ref', datepickerRef.current)
  return (
    <DatePickerWrapper ref={datepickerRef}>
      <DatePicker container={()=>datepickerRef.current} {...props} value={valueAsDate} onChange={setValueAsString} />
    </DatePickerWrapper>
  );
}

const DatePickerWrapper = styled.div`
  width: 250px
`

export const MissionDetail = ({routeParams})  => {
  const id = parseInt(routeParams?.params?.id)
  console.log('id:', id)
  const { mission } = useGetMissionsQuery(undefined, {
    selectFromResult: ({ data }) =>  ({
      mission: data?.find(op => op.id === id),
    }),
  })
  const [
    updateMission,
    { isLoading: isUpdating },
  ] = useUpdateMissionMutation()


  if (id === undefined) {
    return<div style={{flex:1}}>not set yet</div>
  }
  
  console.log(isUpdating, JSON.stringify(mission))
  
  return (
    <div style={{flex:1}}>
      <div>
        <h1>Ajout d&apos;une nouvelle mission</h1>
      </div>
      <h3>Informations générales</h3>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: mission?.id,
          typeMission: mission?.typeMission,
          statusMission: mission?.statusMission,
          facade: mission?.facade,
          theme: mission?.theme,
          inputStartDatetimeUtc: mission?.inputStartDatetimeUtc,
          inputEndDatetimeUtc: mission?.inputEndDatetimeUtc || ''
        }}
        onSubmit={values => {
          console.log('values', JSON.stringify(values))
          updateMission(values).then(({data})=> {
            if (data) {
              console.log("ok")
            }
          })
        }}
      >
        {(formikProps)=>{
          return (
            <Form onSubmit={formikProps.handleSubmit} onReset={formikProps.handleReset}>
              <Form.Group>
                <Form.ControlLabel htmlFor="inputStartDatetimeUtc">Début : </Form.ControlLabel>
                  <FormikDatePicker name="inputStartDatetimeUtc" placeholder={'Début'} oneTap/>
                <Form.ControlLabel htmlFor="inputEndDatetimeUtc">Début : </Form.ControlLabel>
                  <FormikDatePicker name="inputEndDatetimeUtc" placeholder={'Fin'} oneTap/>
                </Form.Group>
              <Form.Group>
                <Form.ControlLabel htmlFor="typeMission">Type Opération : </Form.ControlLabel>
                <Field name="typeMission"type="text"/>
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel htmlFor="statusMission">Statut Opération : </Form.ControlLabel>
                <Field name="statusMission"type="text"/>
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel htmlFor="facade">Façade : </Form.ControlLabel>
                <Field name="facade"type="text"/>
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel htmlFor="theme">theme : </Form.ControlLabel>
                <Field name="theme"type="text"/>
              </Form.Group>
              <Form.Group>
                <PrimaryButton type="submit">
                  Enregistrer
                </PrimaryButton>
              </Form.Group>
            </Form>
          )
        }}
      </Formik>
  </div>)
}