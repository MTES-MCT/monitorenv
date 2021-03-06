import React, { useState } from 'react'
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Formik, FieldArray } from 'formik';
import { Form } from 'rsuite'

import {  useCreateMissionMutation } from '../../api/missionsAPI'
import { setSideWindowPath } from '../commonComponents/SideWindowRouter/SideWindowRouter.slice';
import { sideWindowPaths } from '../../domain/entities/sideWindow';

import { SideWindowHeader } from '../side_window/SideWindowHeader';
import { ActionsForm } from './MissionDetails/ActionsForm'
import { ActionForm } from './MissionDetails/ActionForm'
import { GeneralInformationsForm } from './MissionDetails/GeneralInformationsForm';

import { COLORS } from '../../constants/constants';
import { MissionValidationModal } from './MissionValidationModal';
import { missionFactory } from './Missions.helpers';
import { PrimaryButton, SecondaryButton } from '../commonStyles/Buttons.style';
 



export const NewMission = ()  => {
  const dispatch = useDispatch()
  const  mission = missionFactory()

  const [
    createMission,
    { isLoading: isUpdating, },
  ] = useCreateMissionMutation()

  const [currentActionIndex, setCurrentActionIndex] = useState(null)
  const [errorOnSave, setErrorOnSave ] = useState(false)
  const [ confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false)  

  const handleSetCurrentActionIndex = (index) =>{
    setCurrentActionIndex(index)
  }

  const handleSubmitForm = values => {
    createMission(values).then((response)=> {
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

  

  const handleConfirmFormCancelation = () => {
    setConfirmationModalIsOpen(true)
  }
  const handleCancelForm = ()=> {
    console.log('form canceled', handleConfirmFormCancelation)
  }

  const handleCancel = () => {
    dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))
  }

  return (
    <EditMissionWrapper data-cy={'editMissionWrapper'}>
      <MissionValidationModal open={confirmationModalIsOpen} onClose={handleCancelForm} />
      <SideWindowHeader title={`Nouvelle mission ${isUpdating ? ' - Enregistrement en cours' : ''}`} />
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
                  <FieldArray name="actions" render={(props)=><ActionsForm {...props} currentActionIndex={currentActionIndex} setCurrentActionIndex={handleSetCurrentActionIndex} />}  />
                </SecondColumn>
                <ThirdColumn>
                  <FieldArray name="actions" render={(props)=><ActionForm {...props} currentActionIndex={currentActionIndex} setCurrentActionIndex={handleSetCurrentActionIndex} />} />
                </ThirdColumn>
              </Wrapper>
              
              <FormActionsWrapper>
                <SecondaryButton onClick={handleCancel} type='button'>Annuler</SecondaryButton>
                <PrimaryButton type='submit'>Enregistrer</PrimaryButton>
                {errorOnSave && <ErrorOnSave>Oups... Erreur au moment de la sauvegarde</ErrorOnSave>}
              </FormActionsWrapper>
            </Form>
          )
        }}
      </Formik>
  </EditMissionWrapper>)
}


const EditMissionWrapper = styled.div`
  flex: 1;
`
const Wrapper = styled.div`
  height: calc(100vh - 118px);
  display: flex;
`
const FirstColumn = styled.div`
  background: ${COLORS.white};
  flex: 1;
  overflow: scroll;
  `
const SecondColumn = styled.div`
  background: ${COLORS.missingGrey};
  flex: 1;
`
const ThirdColumn = styled.div`
  background: ${COLORS.gainsboro};
  flex: 1;
  overflow: scroll;
`

const ErrorOnSave = styled.div`
  backgound: ${COLORS.orange};

`

const FormActionsWrapper = styled.div`
  text-align: right;
  padding: 18px;
`
