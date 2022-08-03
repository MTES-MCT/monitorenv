import React, { useState } from 'react'
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Formik, FieldArray } from 'formik';
import { Form, Button, IconButton, ButtonToolbar } from 'rsuite'
import { useGetMissionsQuery, useUpdateMissionMutation, useCreateMissionMutation } from '../../api/missionsAPI'
import { setSideWindowPath } from '../commonComponents/SideWindowRouter/SideWindowRouter.slice';
import { sideWindowPaths } from '../../domain/entities/sideWindow';

import { SideWindowHeader } from '../side_window/SideWindowHeader';
import { ActionsForm } from './MissionDetails/ActionsForm'
import { ActionForm } from './MissionDetails/ActionForm'
import { GeneralInformationsForm } from './MissionDetails/GeneralInformationsForm';

import { missionFactory } from './Missions.helpers'

import { ReactComponent as SaveSVG } from '../icons/enregistrer_16px.svg'
import { MissionValidationModal } from './MissionValidationModal';
import { COLORS } from '../../constants/constants';

 



export const CreateOrEditMission = ({routeParams})  => {
  const dispatch = useDispatch()
  const [currentActionIndex, setCurrentActionIndex] = useState(null)
  const [errorOnSave, setErrorOnSave ] = useState(false)
  const [ confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false)  

  const handleSetCurrentActionIndex = (index) =>{
    setCurrentActionIndex(index)
  }
  
  const id = parseInt(routeParams?.params?.id)

  const { missionToEdit } = useGetMissionsQuery(undefined, {
    selectFromResult: ({ data }) =>  ({
      missionToEdit: data?.find(op => op.id === id),
    }),
  })

  const [
    updateMission,
    { isLoading: isLoadingUpdateMission, },
  ] = useUpdateMissionMutation()

  const [
    createMission,
    { isLoading: isLoadingCreateMission, },
  ] = useCreateMissionMutation()
  
  const newMission = missionFactory()
  
  const mission = id === undefined ? newMission : missionToEdit
  const upsertMission = id === undefined ?  createMission : updateMission


  const handleSubmitForm = values => {
    upsertMission(values).then((response)=> {
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
      <SideWindowHeader 
        title={`Edition de la mission n°${id}${isLoadingUpdateMission || isLoadingCreateMission ? ' - Enregistrement en cours' : ''}`} 
        />
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: mission?.id,
          missionType: mission?.missionType,
          missionNature: mission?.missionNature,
          missionStatus: mission?.missionStatus,
          facade: mission?.facade,
          geom: mission?.geom,
          observations: mission?.observations,
          open_by: mission?.open_by,
          closed_by: mission?.closed_by,
          inputStartDatetimeUtc: mission?.inputStartDatetimeUtc,
          inputEndDatetimeUtc: mission?.inputEndDatetimeUtc || '',
          administration: mission?.administration,
          unit: mission?.unit,
          resources: mission?.resources,
          envActions: mission?.envActions
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
                  <FieldArray name='envActions' render={(props)=><ActionsForm {...props} currentActionIndex={currentActionIndex} setCurrentActionIndex={handleSetCurrentActionIndex} />}  />
                </SecondColumn>
                <ThirdColumn>
                  <FieldArray name='envActions' render={(props)=><ActionForm {...props} currentActionIndex={currentActionIndex} setCurrentActionIndex={handleSetCurrentActionIndex} />} />
                </ThirdColumn>
              </Wrapper>
              
              <FormActionsWrapper>
                <Button onClick={handleCancel} type='button' size='sm'>Annuler</Button>
                <IconButton appearance='ghost' type='submit' size='sm' icon={<SaveSVG className={"rs-icon"}/>}>Enregistrer</IconButton>
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
  background: ${COLORS.cultured};
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

const FormActionsWrapper = styled(ButtonToolbar)`
  border-top: 1px solid ${COLORS.lightGray};
  text-align: right;
  padding: 18px;
`
