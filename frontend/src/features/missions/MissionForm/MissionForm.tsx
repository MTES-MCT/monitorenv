import { FieldArray, useFormikContext } from 'formik'
import _ from 'lodash'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Mission, MissionSourceEnum } from '../../../domain/entities/missions'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setIsClosedMission, setMissionState } from '../../../domain/shared_slices/MissionsState'
import { deleteMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/deleteMission'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useSyncFormValuesWithRedux } from '../../../hooks/useSyncFormValuesWithRedux'
import { sideWindowActions } from '../../SideWindow/slice'
import { MissionCancelEditModal } from '../MissionCancelEditModal'
import { MissionDeleteModal } from '../MissionDeleteModal'
import { ActionForm } from './ActionForm/ActionForm'
import { ActionsForm } from './ActionsForm'
import { GeneralInformationsForm } from './GeneralInformationsForm'
import { useUpdateSurveillance } from './hooks/useUpdateSurveillance'
import { MissionFormBottomBar } from './MissionFormBottomBar'

export function MissionForm({ id, mission, setShouldValidateOnChange }) {
  const dispatch = useDispatch()
  const { missionState, sideWindow } = useAppSelector(state => state)
  const { dirty, handleSubmit, validateForm, values } = useFormikContext<Mission>()

  useSyncFormValuesWithRedux(setMissionState)
  useUpdateSurveillance()

  const [currentActionIndex, setCurrentActionIndex] = useState(undefined)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

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

  const allowCloseMission = !mission?.isClosed || !values?.isClosed || !missionState.isClosedMission

  const handleSaveMission = async () => {
    await dispatch(setIsClosedMission(missionState.isClosedMission))
    validateForm().then(errors => {
      if (_.isEmpty(errors)) {
        handleSubmit()

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  const handleCloseMission = async () => {
    await dispatch(setIsClosedMission(true))
    validateForm().then(errors => {
      if (_.isEmpty(errors)) {
        handleSubmit()

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  const handleReopenMission = async () => {
    dispatch(setIsClosedMission(false))
  }

  const handleConfirmFormCancelation = () => {
    if (dirty) {
      dispatch(sideWindowActions.setShowConfirmCancelModal(true))
    } else {
      handleCancelForm()
    }
  }

  return (
    <StyledFormContainer>
      <MissionCancelEditModal
        onCancel={handleReturnToEdition}
        onConfirm={handleCancelForm}
        open={sideWindow.showConfirmCancelModal && dirty}
      />
      <MissionDeleteModal onCancel={handleReturnToEdition} onConfirm={handleDelete} open={deleteModalIsOpen} />
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
        isFromMonitorFish={mission?.missionSource === MissionSourceEnum.MONITORFISH}
        onCloseMission={handleCloseMission}
        onDeleteMission={handleDeleteMission}
        onQuitFormEditing={handleConfirmFormCancelation}
        onReopenMission={handleReopenMission}
        onSaveMission={handleSaveMission}
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
  height: calc(100vh - 68px);
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
