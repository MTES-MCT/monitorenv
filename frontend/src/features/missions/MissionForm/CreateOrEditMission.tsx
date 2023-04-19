/* eslint-disable react/jsx-props-no-spreading */

import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik, FieldArray } from 'formik'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { matchPath } from 'react-router-dom'
import styled from 'styled-components'

import { useGetMissionQuery } from '../../../api/missionsAPI'
import { COLORS } from '../../../constants/constants'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setMissionState } from '../../../domain/shared_slices/MissionsState'
import { createOrEditMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/createOrEditMission'
import { deleteMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/deleteMission'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { SyncFormValuesWithRedux } from '../../../hooks/useSyncFormValuesWithRedux'
import { FormikForm } from '../../../uiMonitor/CustomFormikFields/FormikForm'
import { Header } from '../../SideWindow/Header'
import { sideWindowActions } from '../../SideWindow/slice'
import { MissionCancelEditModal } from '../MissionCancelEditModal'
import { MissionDeleteModal } from '../MissionDeleteModal'
import { missionFactory } from '../Missions.helpers'
import { ActionForm } from './ActionForm/ActionForm'
import { ActionsForm } from './ActionsForm'
import { GeneralInformationsForm } from './GeneralInformationsForm'
import { MissionFormBottomBar } from './MissionFormBottomBar'

export function CreateOrEditMission() {
  const dispatch = useDispatch()
  const { sideWindow } = useAppSelector(state => state)

  const routeParams = matchPath<{ id: string }>(sideWindow.currentPath, {
    exact: true,
    path: [sideWindowPaths.MISSION, sideWindowPaths.MISSION_NEW],
    strict: true
  })
  const [currentActionIndex, setCurrentActionIndex] = useState(null)
  const [cancelEditModalIsOpen, setCancelEditModalIsOpen] = useState(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

  const id = routeParams?.params?.id ? parseInt(routeParams?.params?.id, 10) : undefined

  const { data: missionToEdit } = useGetMissionQuery(id ?? skipToken)

  const missionFormikValues = useMemo(() => missionFactory(missionToEdit), [missionToEdit])

  const handleSetCurrentActionIndex = index => {
    setCurrentActionIndex(index)
  }

  const handleSubmitForm = values => {
    createOrEditMissionAndGoToMissionsList(values)
  }

  const handleReturnToEdition = () => {
    setCancelEditModalIsOpen(false)
    setDeleteModalIsOpen(false)
  }

  const handleDelete = () => {
    deleteMissionAndGoToMissionsList(id)
  }
  const handleCancelForm = () => {
    dispatch(sideWindowActions.openAndGoTo(sideWindowPaths.MISSIONS))
  }

  const handleDeleteMission = () => {
    setDeleteModalIsOpen(true)
  }

  if (id && !missionToEdit) {
    return <Loading>Chargement en cours</Loading>
  }

  return (
    <EditMissionWrapper data-cy="editMissionWrapper">
      <Header title={`Edition de la mission${id ? ' - Enregistrement en cours' : ''}`} />
      <Formik enableReinitialize initialValues={missionFormikValues} onSubmit={handleSubmitForm}>
        {formikProps => {
          const handleCloseMission = () => {
            formikProps.setFieldValue('isClosed', true)
            if (formikProps.dirty) {
              setCancelEditModalIsOpen(true)
            } else {
              handleCancelForm()
            }
          }
          const handleReopenMission = () => {
            formikProps.setFieldValue('isClosed', false)
            formikProps.submitForm()
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

              <MissionFormBottomBar
                allowDelete={!(id === undefined)}
                closeMission={handleCloseMission}
                deleteMission={handleDeleteMission}
                isClosed={isClosed}
                quitFormEditing={handleCancelForm}
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
