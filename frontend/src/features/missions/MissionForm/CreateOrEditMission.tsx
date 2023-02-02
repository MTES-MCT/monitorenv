/* eslint-disable react/jsx-props-no-spreading */

import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik, FieldArray } from 'formik'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { matchPath } from 'react-router-dom'
import styled from 'styled-components'

import {
  useGetMissionQuery,
  useUpdateMissionMutation,
  useCreateMissionMutation,
  useDeleteMissionMutation
} from '../../../api/missionsAPI'
import { setSideWindowPath } from '../../../components/SideWindowRouter/SideWindowRouter.slice'
import { COLORS } from '../../../constants/constants'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setError } from '../../../domain/shared_slices/Global'
import { setMissionState } from '../../../domain/shared_slices/MissionsState'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { SyncFormValuesWithRedux } from '../../../hooks/useSyncFormValuesWithRedux'
import { FormikForm } from '../../../uiMonitor/CustomFormikFields/FormikForm'
import { SideWindowHeader } from '../../side_window/SideWindowHeader'
import { MissionCancelEditModal } from '../MissionCancelEditModal'
import { MissionDeleteModal } from '../MissionDeleteModal'
import { missionFactory } from '../Missions.helpers'
import { MissionSchema } from '../MissionSchema'
import { ActionForm } from './ActionForm/ActionForm'
import { ActionsForm } from './ActionsForm'
import { GeneralInformationsForm } from './GeneralInformationsForm'
import { MissionFormBottomBar } from './MissionFormBottomBar'

export function CreateOrEditMission() {
  const dispatch = useDispatch()
  const { sideWindowPath } = useAppSelector(state => state.sideWindowRouter)

  const routeParams = matchPath<{ id: string }>(sideWindowPath, {
    exact: true,
    path: [sideWindowPaths.MISSION, sideWindowPaths.MISSION_NEW],
    strict: true
  })
  const [currentActionIndex, setCurrentActionIndex] = useState(null)
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
        dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))
        setErrorOnSave(false)
      } else {
        dispatch(setError(response.error))
        setErrorOnSave(true)
      }
    })
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
        dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))
      }
    })
  }
  const handleCancelForm = () => {
    dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))
  }

  const handleDeleteMission = () => {
    setDeleteModalIsOpen(true)
  }

  if (id && !missionToEdit) {
    return <Loading>Chargement en cours</Loading>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <SideWindowHeader
        title={`Edition de la mission${
          isLoadingUpdateMission || isLoadingCreateMission ? ' - Enregistrement en cours' : ''
        }`}
      />
      <Formik
        enableReinitialize
        initialValues={missionFormikValues}
        onSubmit={handleSubmitForm}
        validationSchema={MissionSchema}
      >
        {formikProps => {
          const handleCloseMission = () => {
            formikProps.setFieldValue('isClosed', true)
            formikProps.validateForm().then(errors => {
              if (_.isEmpty(errors)) {
                formikProps.handleSubmit()
              } else {
                formikProps.setFieldValue('isClosed', false)
              }
            })
          }
          const handleReopenMission = () => {
            formikProps.setFieldValue('isClosed', false)
          }
          const handleQuitFormEditing = () => {
            formikProps.setFieldValue('isClosed', false)
            if (formikProps.dirty) {
              setCancelEditModalIsOpen(true)
            } else {
              handleCancelForm()
            }
          }
          const { isClosed } = formikProps.values

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
                    render={props => (
                      <ActionForm
                        {...props}
                        currentActionIndex={currentActionIndex}
                        setCurrentActionIndex={handleSetCurrentActionIndex}
                      />
                    )}
                  />
                </ThirdColumn>
              </Wrapper>

              <MissionFormBottomBar
                allowDelete={!(id === undefined)}
                closeMission={handleCloseMission}
                deleteMission={handleDeleteMission}
                errorOnDelete={errorOnDelete}
                errorOnSave={errorOnSave}
                isClosed={isClosed}
                quitFormEditing={handleQuitFormEditing}
                reopenMission={handleReopenMission}
              />
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
