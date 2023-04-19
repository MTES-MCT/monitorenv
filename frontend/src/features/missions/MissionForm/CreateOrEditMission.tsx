/* eslint-disable react/jsx-props-no-spreading */

import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik, FieldArray } from 'formik'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { matchPath } from 'react-router-dom'
import styled from 'styled-components'

import { useGetMissionQuery } from '../../../api/missionsAPI'
import { COLORS } from '../../../constants/constants'
import { MissionSourceEnum } from '../../../domain/entities/missions'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setMissionState } from '../../../domain/shared_slices/MissionsState'
import { createOrEditMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/createOrEditMission'
import { deleteMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/deleteMission'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { SyncFormValuesWithRedux } from '../../../hooks/useSyncFormValuesWithRedux'
import { MissionSourceTag } from '../../../ui/MissionSourceTag'
import { FormikForm } from '../../../uiMonitor/CustomFormikFields/FormikForm'
import { Header } from '../../SideWindow/Header'
import { sideWindowActions } from '../../SideWindow/slice'
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
  const { sideWindow } = useAppSelector(state => state)

  const routeParams = matchPath<{ id: string }>(sideWindow.currentPath, {
    exact: true,
    path: [sideWindowPaths.MISSION, sideWindowPaths.MISSION_NEW],
    strict: true
  })

  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)
  const [currentActionIndex, setCurrentActionIndex] = useState(undefined)
  const [cancelEditModalIsOpen, setCancelEditModalIsOpen] = useState(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

  const id = routeParams?.params?.id ? parseInt(routeParams?.params?.id, 10) : undefined

  const { data: missionToEdit } = useGetMissionQuery(id ?? skipToken)

  const missionFormikValues = useMemo(() => missionFactory(missionToEdit), [missionToEdit])

  const allowEditMission =
    missionToEdit?.missionSource === undefined ||
    missionToEdit?.missionSource === MissionSourceEnum.MONITORENV ||
    missionToEdit?.missionSource === MissionSourceEnum.MONITORFISH
  const allowDeleteMission = !(id === undefined) && allowEditMission

  const handleSetCurrentActionIndex = index => {
    setCurrentActionIndex(index)
  }

  const handleSubmitForm = values => {
    dispatch(createOrEditMissionAndGoToMissionsList(values))
  }

  const handleReturnToEdition = () => {
    setCancelEditModalIsOpen(false)
    setDeleteModalIsOpen(false)
  }

  const handleDelete = () => {
    dispatch(deleteMissionAndGoToMissionsList(id))
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
      <Header title="Edition de la mission">
        <MissionSourceTag source={missionToEdit?.missionSource} />
      </Header>
      <Formik
        enableReinitialize
        initialValues={missionFormikValues}
        onSubmit={handleSubmitForm}
        validateOnBlur={false}
        validateOnChange={shouldValidateOnChange}
        validateOnMount={false}
        validationSchema={MissionSchema}
      >
        {formikProps => {
          const allowCloseMission = !missionToEdit?.isClosed || !formikProps.values?.isClosed

          const handleSaveMission = async () => {
            await formikProps.setFieldValue('isClosed', false)
            formikProps.validateForm().then(errors => {
              if (_.isEmpty(errors)) {
                formikProps.handleSubmit()

                return
              }
              setShouldValidateOnChange(true)
            })
          }

          const handleCloseMission = async () => {
            await formikProps.setFieldValue('isClosed', true)
            formikProps.validateForm().then(errors => {
              if (_.isEmpty(errors)) {
                formikProps.handleSubmit()

                return
              }
              setShouldValidateOnChange(true)
            })
          }

          const handleReopenMission = () => {
            formikProps.setFieldValue('isClosed', false)
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
                    render={({ form, remove, unshift }) => (
                      <ActionsForm
                        currentActionIndex={currentActionIndex}
                        form={form}
                        remove={remove}
                        setCurrentActionIndex={handleSetCurrentActionIndex}
                        unshift={unshift}
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
                allowClose={allowCloseMission}
                allowDelete={allowDeleteMission}
                allowEdit={allowEditMission}
                closeMission={handleCloseMission}
                deleteMission={handleDeleteMission}
                quitFormEditing={handleCancelForm}
                reopenMission={handleReopenMission}
                saveMission={handleSaveMission}
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
