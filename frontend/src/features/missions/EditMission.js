import React, { useState } from 'react'
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Formik, FieldArray } from 'formik';
import { Form } from 'rsuite'

import { useGetMissionsQuery, useUpdateMissionMutation } from '../../api/missionsAPI'
import { setSideWindowPath } from '../commonComponents/SideWindowRouter/SideWindowRouter.slice';
import { sideWindowPaths } from '../../domain/entities/sideWindow';

import { SideWindowHeader } from '../side_window/SideWindowHeader';
import { ActionsForm } from './MissionDetails/ActionsForm'
import { ActionForm } from './MissionDetails/ActionForm'
import { GeneralInformationsForm } from './MissionDetails/GeneralInformationsForm';

import { COLORS } from '../../constants/constants';
import { MissionValidationModal } from './MissionValidationModal';
import { PrimaryButton, SecondaryButton } from '../commonStyles/Buttons.style';
 



export const EditMission = ({routeParams})  => {
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
  const [ confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false)  
  
  if (id === undefined) {
    return<div style={{flex:1}}>Aucune mission sélectionnée</div>
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
      <SideWindowHeader title={`Edition de la mission n°${id}${isUpdating ? ' - Enregistrement en cours' : ''}`} />
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: mission?.id,
          missionType: mission?.missionType,
          missionStatus: mission?.missionStatus,
          facade: mission?.facade,
          theme: mission?.theme,
          geom: mission?.geom,
          observations: mission?.observations,
          author: mission?.author,
          closed_by: mission?.closed_by,
          inputStartDatetimeUtc: mission?.inputStartDatetimeUtc,
          inputEndDatetimeUtc: mission?.inputEndDatetimeUtc || '',
          administration: mission?.administration,
          unit: mission?.unit,
          resources: mission?.resources,
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
                  <FieldArray name='actions' render={(props)=><ActionsForm {...props} currentActionIndex={currentActionIndex} setCurrentActionIndex={handleSetCurrentActionIndex} />}  />
                </SecondColumn>
                <ThirdColumn>
                  <FieldArray name='actions' render={(props)=><ActionForm {...props} currentActionIndex={currentActionIndex} setCurrentActionIndex={handleSetCurrentActionIndex} />} />
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
  display: flex;
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
  border-top: 1px solid ${COLORS.lightGray};
  text-align: right;
  padding: 18px;
`
