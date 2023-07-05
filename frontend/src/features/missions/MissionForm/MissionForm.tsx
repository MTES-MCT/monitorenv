import { FieldArray, useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { generatePath } from 'react-router'
import styled from 'styled-components'

import { ActionForm } from './ActionForm/ActionForm'
import { ActionsForm } from './ActionsForm'
import { GeneralInformationsForm } from './GeneralInformationsForm'
import { useUpdateSurveillance } from './hooks/useUpdateSurveillance'
import { MissionFormBottomBar } from './MissionFormBottomBar'
import { CancelEditModal } from './modals/CancelEditModal'
import { DeleteModal } from './modals/DeleteModal'
import { ReopenModal } from './modals/ReopenModal'
import { Mission, MissionSourceEnum, NewMission } from '../../../domain/entities/missions'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setToast } from '../../../domain/shared_slices/Global'
import { setMissionState } from '../../../domain/shared_slices/MissionsState'
import { multiMissionsActions } from '../../../domain/shared_slices/MultiMissions'
import { deleteMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/deleteMission'
import { saveMission } from '../../../domain/use_cases/missions/saveMission'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useSyncFormValuesWithRedux } from '../../../hooks/useSyncFormValuesWithRedux'
import { sideWindowActions } from '../../SideWindow/slice'

export function MissionForm({ id, isAlreadyClosed, isNewMission, selectedMission, setShouldValidateOnChange }) {
  const dispatch = useDispatch()
  const { sideWindow } = useAppSelector(state => state)
  const { dirty, handleSubmit, setFieldValue, setValues, validateForm, values } =
    useFormikContext<Partial<Mission | NewMission>>()

  useSyncFormValuesWithRedux(setMissionState)
  useUpdateSurveillance()

  useEffect(() => {
    if (selectedMission) {
      setValues(selectedMission)
    }
  }, [setValues, selectedMission])

  const [currentActionIndex, setCurrentActionIndex] = useState(undefined)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false)

  const allowEditMission =
    selectedMission?.missionSource === undefined ||
    selectedMission?.missionSource === MissionSourceEnum.MONITORENV ||
    selectedMission?.missionSource === MissionSourceEnum.MONITORFISH
  const allowDeleteMission = !isNewMission && allowEditMission
  const allowCloseMission = !selectedMission?.isClosed || !values?.isClosed

  const handleSetCurrentActionIndex = index => {
    setCurrentActionIndex(index)
  }

  const returnToEdition = () => {
    dispatch(sideWindowActions.setShowConfirmCancelModal(false))
    setDeleteModalIsOpen(false)
    setIsReopenModalOpen(false)
  }
  const validateDeleteMission = () => {
    dispatch(deleteMissionAndGoToMissionsList(id))
  }

  const deleteMission = () => {
    setDeleteModalIsOpen(true)
  }

  const cancelForm = async () => {
    await dispatch(multiMissionsActions.deleteSelectedMission(id))
    dispatch(sideWindowActions.setShowConfirmCancelModal(false))
    dispatch(sideWindowActions.setCurrentPath(generatePath(sideWindowPaths.MISSIONS)))
  }

  const submitMission = async () => {
    setShouldValidateOnChange(false)

    // If the mission is not already closed (from the API), we want the `isClosed` field to be set to false.
    // if the user has already tried to close the mission and the `isClosed` field is set to true.
    if (!isAlreadyClosed) {
      await setFieldValue('isClosed', false)
    }
    validateForm().then(errors => {
      if (_.isEmpty(errors)) {
        handleSubmit()

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  const closeMission = async () => {
    await setFieldValue('isClosed', true)
    validateForm().then(errors => {
      if (_.isEmpty(errors)) {
        handleSubmit()

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  const reopenMission = () => {
    validateForm({ ...values, isClosed: false }).then(errors => {
      if (_.isEmpty(errors)) {
        if (dirty) {
          return setIsReopenModalOpen(true)
        }

        return validateReopenMission()
      }
      setFieldValue('isClosed', true)

      return setShouldValidateOnChange(true)
    })
  }

  const validateReopenMission = async () => {
    await dispatch(saveMission({ ...values, isClosed: false }, true))
    dispatch(
      setToast({
        containerId: 'sideWindow',
        message: 'La mission a bien été réouverte',
        type: 'success'
      })
    )
    setIsReopenModalOpen(false)
  }

  const confirmFormCancelation = () => {
    if (dirty) {
      dispatch(sideWindowActions.setShowConfirmCancelModal(true))
    } else {
      cancelForm()
    }
  }

  return (
    <StyledFormContainer>
      <CancelEditModal
        onCancel={returnToEdition}
        onConfirm={cancelForm}
        open={sideWindow.showConfirmCancelModal && dirty}
      />
      <DeleteModal onCancel={returnToEdition} onConfirm={validateDeleteMission} open={deleteModalIsOpen} />
      <ReopenModal onCancel={returnToEdition} onConfirm={validateReopenMission} open={isReopenModalOpen} />
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
        isFromMonitorFish={selectedMission?.missionSource === MissionSourceEnum.MONITORFISH}
        onCloseMission={closeMission}
        onDeleteMission={deleteMission}
        onQuitFormEditing={confirmFormCancelation}
        onReopenMission={reopenMission}
        onSaveMission={submitMission}
      />
    </StyledFormContainer>
  )
}

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Wrapper = styled.div`
  height: calc(100vh - 116px);
  display: flex;
  flex-direction: row;
`
const FirstColumn = styled.div`
  background: ${p => p.theme.color.white};
  flex: 1;
  overflow-y: auto;
`

const SecondColumn = styled.div`
  background: ${p => p.theme.color.cultured};
  overflow-y: auto;
  flex: 1;
`
const ThirdColumn = styled.div`
  background: ${p => p.theme.color.gainsboro};
  flex: 1;
  overflow-y: auto;
`
