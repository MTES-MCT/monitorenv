import React, { useMemo, useState } from 'react'
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Formik, FieldArray } from 'formik';
import { Form, Button, IconButton, ButtonToolbar } from 'rsuite'

import { useGetMissionsQuery, useUpdateMissionMutation, useCreateMissionMutation, useDeleteMissionMutation } from '../../api/missionsAPI'
import { setSideWindowPath } from '../commonComponents/SideWindowRouter/SideWindowRouter.slice';
import { sideWindowPaths } from '../../domain/entities/sideWindow';
import { missionStatusEnum } from '../../domain/entities/missions';

import { SideWindowHeader } from '../side_window/SideWindowHeader';
import { ActionsForm } from './MissionDetails/ActionsForm'
import { ActionForm } from './MissionDetails/ActionForm'
import { GeneralInformationsForm } from './MissionDetails/GeneralInformationsForm';
import { MissionValidationModal } from './MissionValidationModal';

import { missionFactory } from './Missions.helpers'

import { ReactComponent as SaveSVG } from '../icons/enregistrer_16px.svg'
import { ReactComponent as DeleteSVG } from '../icons/Suppression_clair.svg'
import { COLORS } from '../../constants/constants';

export const CreateOrEditMission = ({routeParams})  => {
  const dispatch = useDispatch()
  const [currentActionIndex, setCurrentActionIndex] = useState(null)
  const [errorOnSave, setErrorOnSave ] = useState(false)
  const [errorOnDelete, setErrorOnDelete ] = useState(false)
  const [ confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false)  

  const handleSetCurrentActionIndex = (index) =>{
    setCurrentActionIndex(index)
  }
  
  
  const id = routeParams?.params?.id && parseInt(routeParams?.params?.id)

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

  const [
    deleteMission
  ] = useDeleteMissionMutation()
  
  
  const mission = useMemo(()=> { return (id === undefined) ? missionFactory() : missionToEdit}, [id, missionToEdit])

  const upsertMission = (id === undefined) ?  createMission : updateMission


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

  const handleDelete = () => {
    deleteMission({id}).then((response)=>{
      const { error} = response
      if (error) {
        console.log(error)
        setErrorOnDelete(true)
      } else {
        dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))
      }
    })
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
        title={`Edition de la mission${isLoadingUpdateMission || isLoadingCreateMission ? ' - Enregistrement en cours' : ''}`} 
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
          resourceUnits: mission?.resourceUnits,
          envActions: mission?.envActions
        }}
        onSubmit={handleSubmitForm}
      >
        {(formikProps)=>{
          const handleCloseMission = () => {
            formikProps.setFieldValue('missionStatus', missionStatusEnum.CLOSED.code)
            formikProps.handleSubmit()
          }
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
              
              <Footer>
                <FormActionsWrapper>
                  {
                    // id is undefined if creating a new mission
                  id && (<IconButton 
                        appearance='ghost'
                        onClick={handleDelete}
                        type='button'
                        size='sm'
                        icon={<DeleteIcon className={"rs-icon"}/>} 
                      >
                        Supprimer la mission
                      </IconButton>)
                  }
                  <Separator/>
                  <Button onClick={handleCancel} type='button' size='sm'>Annuler</Button>
                  <IconButton appearance='ghost' type='submit' size='sm' icon={<SaveSVG className={"rs-icon"}/>}>Enregistrer</IconButton>
                  <IconButton 
                    disabled={!(mission.missionStatus === missionStatusEnum.ENDED.code)} 
                    appearance='primary' 
                    type='button' 
                    size='sm' 
                    onClick={handleCloseMission}
                    icon={<SaveSVG className={"rs-icon"}/>}>
                      Enregistrer et clôturer
                    </IconButton>
                </FormActionsWrapper>
                {errorOnSave && <ErrorOnSave>Oups... Erreur au moment de la sauvegarde</ErrorOnSave>}
                {errorOnDelete && <ErrorOnDelete>Oups... Erreur au moment de la suppression</ErrorOnDelete>}
              </Footer>
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
  text-align: right;
`
const ErrorOnDelete = styled.div`
  backgound: ${COLORS.orange};
`
const Separator = styled.div`
  flex: 1;
`
const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`
const Footer = styled.div`
border-top: 1px solid ${COLORS.lightGray};
padding: 18px;
`
const FormActionsWrapper = styled(ButtonToolbar)`
  display: flex;
`
