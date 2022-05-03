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
import { useDispatch } from 'react-redux';
import { setSideWindowPath } from '../commonComponents/SideWindowRouter/SideWindowRouter.slice';
import { sideWindowPaths } from '../../domain/entities/sideWindow';
 



export const Mission = ({routeParams})  => {
  const dispatch = useDispatch()
  const id = parseInt(routeParams?.params?.id)
  const { mission } = useGetMissionsQuery(undefined, {
    selectFromResult: ({ data }) =>  ({
      mission: data?.find(op => op.id === id),
    }),
  })
  const [
    updateMission,
    { isLoading: isUpdating, },
  ] = useUpdateMissionMutation()

  const [currentActionIndex, setCurrentActionIndex] = useState(null)
  const [errorOnSave, setErrorOnSave ] = useState(false)
  
  if (id === undefined) {
    return<div style={{flex:1}}>not set yet</div>
  }
  
  

  const handleSetCurrentActionIndex = (index) =>{
    setCurrentActionIndex(index)
  }

  const handleSubmitForm = values => {
    updateMission(values).then((response)=> {
      const {data, error} = response
      if (data) {
        dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))
        setErrorOnSave(false)
      } else {
        console.log(error)
        setErrorOnSave(true)
      }
    })
  }

  return (
    <div style={{flex:1}}>
      <SideWindowHeader title={`Edition de la mission n°${id}${isUpdating && ' - Enregistrement en cours'}`} />
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: mission?.id,
          missionType: mission?.missionType,
          missionStatus: mission?.missionStatus,
          facade: mission?.facade,
          theme: mission?.theme,
          observations: mission?.observations,
          inputStartDatetimeUtc: mission?.inputStartDatetimeUtc,
          inputEndDatetimeUtc: mission?.inputEndDatetimeUtc || '',
          actions: mission?.actions
        }}
        onSubmit={handleSubmitForm}
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
                {errorOnSave && <ErrorOnSave>Oups... Erreur au moment de la sauvegarde</ErrorOnSave>}
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

const ErrorOnSave = styled.div`
  backgound: ${COLORS.orange};

`
