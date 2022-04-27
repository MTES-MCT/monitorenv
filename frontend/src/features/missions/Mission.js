import React, { useState } from 'react'
import { Formik, FieldArray } from 'formik';
import { Form } from 'rsuite'

import { useGetMissionsQuery, useUpdateMissionMutation } from '../../api/missionsAPI'

import { SideWindowHeader } from '../side_window/SideWindowHeader';
import { ActionsForm } from './MissionDetails/ActionsForm'
import { ActionForm } from './MissionDetails/ActionForm'

import { PrimaryButton } from '../commonStyles/Buttons.style';
import styled from 'styled-components';
import { COLORS } from '../../constants/constants';
import { GeneralInformationsForm } from './MissionDetails/GeneralInformationsForm';
 



export const Mission = ({routeParams})  => {
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

  const [currentActionIndex, setCurrentActionIndex] = useState(null)

  if (id === undefined) {
    return<div style={{flex:1}}>not set yet</div>
  }
  
  console.log(isUpdating, JSON.stringify(mission))

  const handleSetCurrentActionIndex = (index) =>{
    console.log('actionindex', index)
    setCurrentActionIndex(index)
  }
  
  return (
    <div style={{flex:1}}>
      <SideWindowHeader title={`Edition de la mission n°${id}`} />
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: mission?.id,
          typeMission: mission?.typeMission,
          statusMission: mission?.statusMission,
          facade: mission?.facade,
          theme: mission?.theme,
          inputStartDatetimeUtc: mission?.inputStartDatetimeUtc,
          inputEndDatetimeUtc: mission?.inputEndDatetimeUtc || '',
          actions: []
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
              <Wrapper>
                <FirstColumn>
                  <GeneralInformationsForm />
                </FirstColumn>
                <SecondColumn>
                  <FieldArray name="actions" render={(props)=><ActionsForm {...props} actionIndex={currentActionIndex} setCurrentActionIndex={handleSetCurrentActionIndex} />}  />
                </SecondColumn>
                <ThirdColumn>
                  <FieldArray name="actions" render={(props)=><ActionForm {...props} actionIndex={currentActionIndex} setCurrentActionIndex={handleSetCurrentActionIndex} />} />
                </ThirdColumn>
              </Wrapper>
              
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

const Wrapper = styled.div`
  display: flex;
`
const FirstColumn = styled.div`
  background: ${COLORS.white};
  flex: 1;
  `
const SecondColumn = styled.div`
  background: ${COLORS.gainsboro};
  flex: 1;
`
const ThirdColumn = styled.div`
  background: ${COLORS.lightGray};
  flex: 1;
`
