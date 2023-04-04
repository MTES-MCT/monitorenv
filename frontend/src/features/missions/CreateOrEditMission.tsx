/* eslint-disable react/jsx-props-no-spreading */
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik, FieldArray } from 'formik'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { matchPath } from 'react-router-dom'
import { Button, IconButton, ButtonToolbar } from 'rsuite'
import styled from 'styled-components'

import {
  useGetMissionQuery,
  useUpdateMissionMutation,
  useCreateMissionMutation,
  useDeleteMissionMutation
} from '../../api/missionsAPI'
import { COLORS } from '../../constants/constants'
import { MissionSourceEnum } from '../../domain/entities/missions'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { setError } from '../../domain/shared_slices/Global'
import { setMissionState } from '../../domain/shared_slices/MissionsState'
import { useAppSelector } from '../../hooks/useAppSelector'
import { SyncFormValuesWithRedux } from '../../hooks/useSyncFormValuesWithRedux'
import { MissionSourceTag } from '../../ui/MissionSourceTag'
import { FormikForm } from '../../uiMonitor/CustomFormikFields/FormikForm'
import { ReactComponent as DeleteSVG } from '../../uiMonitor/icons/Delete.svg'
import { ReactComponent as SaveSVG } from '../../uiMonitor/icons/Save.svg'
import { Header } from '../SideWindow/Header'
import { sideWindowActions } from '../SideWindow/slice'
import { MissionCancelEditModal } from './MissionCancelEditModal'
import { MissionDeleteModal } from './MissionDeleteModal'
import { ActionForm } from './MissionForm/ActionForm/ActionForm'
import { ActionsForm } from './MissionForm/ActionsForm'
import { GeneralInformationsForm } from './MissionForm/GeneralInformationsForm'
import { missionFactory } from './Missions.helpers'

export function CreateOrEditMission() {
  const dispatch = useDispatch()
  const { sideWindow } = useAppSelector(state => state)

  const routeParams = matchPath<{ id: string }>(sideWindow.currentPath, {
    exact: true,
    path: [sideWindowPaths.MISSION, sideWindowPaths.MISSION_NEW],
    strict: true
  })
  const [currentActionIndex, setCurrentActionIndex] = useState(undefined)
  const [errorOnSave, setErrorOnSave] = useState(false)
  const [errorOnDelete, setErrorOnDelete] = useState(false)
  const [cancelEditModalIsOpen, setCancelEditModalIsOpen] = useState(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

  const id = routeParams?.params?.id ? parseInt(routeParams?.params?.id, 10) : undefined

  const { data: missionToEdit } = useGetMissionQuery(id ?? skipToken)

  const [updateMission, { isLoading: isLoadingUpdateMission }] = useUpdateMissionMutation()

  const [createMission, { isLoading: isLoadingCreateMission }] = useCreateMissionMutation()

  const [deleteMission] = useDeleteMissionMutation()

  const missionFormikValues = useMemo(() => missionFactory(missionToEdit), [missionToEdit])

  const upsertMission = id === undefined ? createMission : updateMission

  const handleSetCurrentActionIndex = index => {
    setCurrentActionIndex(index)
  }

  const handleSubmitForm = values => {
    upsertMission(values).then(response => {
      if ('data' in response) {
        dispatch(sideWindowActions.openAndGoTo(sideWindowPaths.MISSIONS))
        setErrorOnSave(false)
      } else {
        dispatch(setError(response.error))
        setErrorOnSave(true)
      }
    })
  }

  const handleConfirmDelete = () => {
    setDeleteModalIsOpen(true)
  }
  const handleReturnToEdition = () => {
    setCancelEditModalIsOpen(false)
    setDeleteModalIsOpen(false)
  }
  const handleDelete = () => {
    deleteMission({ id }).then(response => {
      if ('error' in response) {
        dispatch(setError(response.error))
        setErrorOnDelete(true)
      } else {
        dispatch(sideWindowActions.openAndGoTo(sideWindowPaths.MISSIONS))
      }
    })
  }
  const handleCancelForm = () => {
    dispatch(sideWindowActions.openAndGoTo(sideWindowPaths.MISSIONS))
  }
  if (id && !missionToEdit) {
    return <Loading>Chargement en cours</Loading>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <Header
        title={`Edition de la mission${
          isLoadingUpdateMission || isLoadingCreateMission ? ' - Enregistrement en cours' : ''
        }`}
      >
        <MissionSourceTag source={missionToEdit?.missionSource} />
      </Header>
      <Formik enableReinitialize initialValues={missionFormikValues} onSubmit={handleSubmitForm}>
        {formikProps => {
          const handleCloseMission = () => {
            formikProps.setFieldValue('isClosed', true)
            formikProps.handleSubmit()
          }
          const handleConfirmFormCancelation = () => {
            if (formikProps.dirty) {
              setCancelEditModalIsOpen(true)
            } else {
              handleCancelForm()
            }
          }

          return (
            <FormikForm>
              <MissionCancelEditModal
                onCancel={handleReturnToEdition}
                onConfirm={handleCancelForm}
                open={cancelEditModalIsOpen}
              />
              <MissionDeleteModal onCancel={handleReturnToEdition} onConfirm={handleDelete} open={deleteModalIsOpen} />
              <SyncFormValuesWithRedux callback={setMissionState} />
              <Wrapper>
                <FirstColumn>
                  <GeneralInformationsForm />
                </FirstColumn>
                <SecondColumn>
                  <FieldArray
                    name="envActions"
                    render={props => (
                      <ActionsForm
                        {...props}
                        currentActionIndex={currentActionIndex}
                        setCurrentActionIndex={handleSetCurrentActionIndex}
                      />
                    )}
                  />
                </SecondColumn>
                <ThirdColumn>
                  <FieldArray
                    name="envActions"
                    render={({ remove }) => (
                      <ActionForm
                        currentActionIndex={currentActionIndex}
                        remove={remove}
                        setCurrentActionIndex={handleSetCurrentActionIndex}
                      />
                    )}
                  />
                </ThirdColumn>
              </Wrapper>

              <Footer>
                <FormActionsWrapper>
                  {
                    // id is undefined if creating a new mission
                    !(id === undefined) && !(missionToEdit?.missionSource === MissionSourceEnum.POSEIDON_CACEM) && (
                      <IconButton
                        appearance="ghost"
                        data-cy="delete-mission"
                        icon={<DeleteIcon className="rs-icon" />}
                        onClick={handleConfirmDelete}
                        type="button"
                      >
                        Supprimer la mission
                      </IconButton>
                    )
                  }
                  <Separator />
                  <Button data-cy="quit-edit-mission" onClick={handleConfirmFormCancelation} type="button">
                    Quitter
                  </Button>
                  {!(missionToEdit?.missionSource === MissionSourceEnum.POSEIDON_CACEM) && (
                    <>
                      <IconButton
                        appearance="ghost"
                        data-cy="save-mission"
                        icon={<SaveSVG className="rs-icon" />}
                        type="submit"
                      >
                        Enregistrer et quitter
                      </IconButton>
                      <IconButton
                        appearance="primary"
                        data-cy="close-mission"
                        icon={<SaveSVG className="rs-icon" />}
                        onClick={handleCloseMission}
                        type="button"
                      >
                        Enregistrer et clôturer
                      </IconButton>
                    </>
                  )}
                </FormActionsWrapper>
                {errorOnSave && <ErrorOnSave>Oups... Erreur au moment de la sauvegarde</ErrorOnSave>}
                {errorOnDelete && <ErrorOnDelete>Oups... Erreur au moment de la suppression</ErrorOnDelete>}
              </Footer>
            </FormikForm>
          )
        }}
      </Formik>
    </EditMissionWrapper>
  )
}

const Loading = styled.div``

const EditMissionWrapper = styled.div`
  flex: 1;
  max-width: 100vw;
`
const Wrapper = styled.div`
  height: calc(100vh - 118px);
  display: flex;
`
const FirstColumn = styled.div`
  background: ${COLORS.white};
  flex: 1;
  overflow-y: auto;
  padding: 32px;
`

const SecondColumn = styled.div`
  background: ${COLORS.cultured};
  overflow-y: auto;
  flex: 1;
`
const ThirdColumn = styled.div`
  background: ${COLORS.gainsboro};
  flex: 1;
  overflow-y: auto;
`

const ErrorOnSave = styled.div`
  background-color: ${COLORS.goldenPoppy};
  text-align: right;
`
const ErrorOnDelete = styled.div`
  background-color: ${COLORS.goldenPoppy};
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
