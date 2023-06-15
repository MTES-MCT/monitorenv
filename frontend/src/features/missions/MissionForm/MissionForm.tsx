import { FieldArray, useFormikContext } from 'formik'
import _ from 'lodash'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Mission, MissionSourceEnum } from '../../../domain/entities/missions'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setMissionState } from '../../../domain/shared_slices/MissionsState'
import { createOrEditMission } from '../../../domain/use_cases/missions/createOrEditMission'
import { deleteMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/deleteMission'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useSyncFormValuesWithRedux } from '../../../hooks/useSyncFormValuesWithRedux'
import { sideWindowActions } from '../../SideWindow/slice'
import { ActionForm } from './ActionForm/ActionForm'
import { ActionsForm } from './ActionsForm'
import { GeneralInformationsForm } from './GeneralInformationsForm'
import { useUpdateSurveillance } from './hooks/useUpdateSurveillance'
import { MissionFormBottomBar } from './MissionFormBottomBar'
import { CancelEditModal } from './modals/CancelEditModal'
import { DeleteModal } from './modals/DeleteModal'
import { ReopenModal } from './modals/ReopenModal'

export function MissionForm({ id, mission, setShouldValidateOnChange }) {
  const dispatch = useDispatch()
  const { sideWindow } = useAppSelector(state => state)
  const { dirty, handleSubmit, setFieldValue, validateForm, values } = useFormikContext<Mission>()

  useSyncFormValuesWithRedux(setMissionState)
  useUpdateSurveillance()

  const [currentActionIndex, setCurrentActionIndex] = useState(undefined)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false)
  const [isReopenMessageVisible, setIsReopenMessageVisible] = useState(false)

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
    setIsReopenModalOpen(false)
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

  const allowCloseMission = !mission?.isClosed || !values?.isClosed

  const handleSaveMission = async () => {
    validateForm().then(errors => {
      if (_.isEmpty(errors)) {
        handleSubmit()

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  const handleCloseMission = async () => {
    await setFieldValue('isClosed', true)
    validateForm().then(errors => {
      if (_.isEmpty(errors)) {
        handleSubmit()

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  const handleReopenMission = async () => {
    validateForm({ ...values, isClosed: false }).then(errors => {
      if (_.isEmpty(errors)) {
        if (dirty) {
          return setIsReopenModalOpen(true)
        }

        return handleReopen()
      }

      return setShouldValidateOnChange(true)
    })
  }

  const handleReopen = async () => {
    dispatch(createOrEditMission({ ...values, isClosed: false }, false))
    setIsReopenMessageVisible(true)
    setIsReopenModalOpen(false)
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
      <CancelEditModal
        onCancel={handleReturnToEdition}
        onConfirm={handleCancelForm}
        open={sideWindow.showConfirmCancelModal && dirty}
      />
      <DeleteModal onCancel={handleReturnToEdition} onConfirm={handleDelete} open={deleteModalIsOpen} />
      <ReopenModal onCancel={handleReturnToEdition} onConfirm={handleReopen} open={isReopenModalOpen} />
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
        isReopenMessageVisible={isReopenMessageVisible}
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
