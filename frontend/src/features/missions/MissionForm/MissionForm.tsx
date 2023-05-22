/* eslint-disable react/jsx-props-no-spreading */

import { Formik, FieldArray } from 'formik'
import _ from 'lodash'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { MissionSourceEnum } from '../../../domain/entities/missions'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setMissionState } from '../../../domain/shared_slices/MissionsState'
import { createOrEditMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/createOrEditMission'
import { deleteMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/deleteMission'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { SyncFormValuesWithRedux } from '../../../hooks/useSyncFormValuesWithRedux'
import { FormikForm } from '../../../uiMonitor/CustomFormikFields/FormikForm'
import { sideWindowActions } from '../../SideWindow/slice'
import { MissionCancelEditModal } from '../MissionCancelEditModal'
import { MissionDeleteModal } from '../MissionDeleteModal'
import { MissionSchema } from '../MissionSchema'
import { ActionForm } from './ActionForm/ActionForm'
import { ActionsForm } from './ActionsForm'
import { GeneralInformationsForm } from './GeneralInformationsForm'
import { MissionFormBottomBar } from './MissionFormBottomBar'

export function MissionForm({ formValues, id, mission }) {
  const dispatch = useDispatch()
  const { sideWindow } = useAppSelector(state => state)

  const [currentActionIndex, setCurrentActionIndex] = useState(undefined)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const allowEditMission =
    mission?.missionSource === undefined ||
    mission?.missionSource === MissionSourceEnum.MONITORENV ||
    mission?.missionSource === MissionSourceEnum.MONITORFISH
  const allowDeleteMission = !(id === undefined) && allowEditMission

  const handleSetCurrentActionIndex = index => {
    setCurrentActionIndex(index)
  }

  const handleReturnToEdition = () => {
    dispatch(sideWindowActions.setShowConfirmCancelModal(false))
    dispatch(sideWindowActions.setNextPath(null))
    setDeleteModalIsOpen(false)
  }
  const handleDelete = () => {
    dispatch(deleteMissionAndGoToMissionsList(id))
  }

  const handleDeleteMission = () => {
    setDeleteModalIsOpen(true)
  }

  const handleCancelForm = () => {
    dispatch(sideWindowActions.focusAndGoTo(sideWindow.nextPath || sideWindowPaths.MISSIONS))
  }

  const handleSubmitForm = values => {
    dispatch(createOrEditMissionAndGoToMissionsList(values))
  }

  return (
    <Formik
      enableReinitialize
      initialValues={formValues}
      onSubmit={handleSubmitForm}
      validateOnBlur={false}
      validateOnChange={shouldValidateOnChange}
      validateOnMount={false}
      validationSchema={MissionSchema}
    >
      {formikProps => {
        const allowCloseMission = !mission?.isClosed || !formikProps.values?.isClosed

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

        const handleConfirmFormCancelation = () => {
          if (formikProps.dirty) {
            dispatch(sideWindowActions.setShowConfirmCancelModal(true))
          } else {
            handleCancelForm()
          }
        }

        return (
          <FormikForm>
            <MissionCancelEditModal
              onCancel={handleReturnToEdition}
              onConfirm={handleCancelForm}
              open={sideWindow.showConfirmCancelModal && formikProps.dirty}
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
                  validateOnChange={false}
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
                  validateOnChange={false}
                />
              </ThirdColumn>
            </Wrapper>

            <MissionFormBottomBar
              allowClose={allowCloseMission}
              allowDelete={allowDeleteMission}
              allowEdit={allowEditMission}
              closeMission={handleCloseMission}
              deleteMission={handleDeleteMission}
              isFromMonitorFish={mission?.missionSource === MissionSourceEnum.MONITORFISH}
              quitFormEditing={handleConfirmFormCancelation}
              reopenMission={handleReopenMission}
              saveMission={handleSaveMission}
            />
          </FormikForm>
        )
      }}
    </Formik>
  )
}

const Wrapper = styled.div`
  height: calc(100vh - 118px);
  display: flex;
`
const FirstColumn = styled.div`
  background: ${COLORS.white};
  flex: 1;
  overflow-y: auto;
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
