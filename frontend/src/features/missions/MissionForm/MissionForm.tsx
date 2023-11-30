import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { generatePath } from 'react-router'
import styled from 'styled-components'

import { ActionForm } from './ActionForm'
import { ActionsForm } from './ActionsForm'
import { GeneralInformationsForm } from './GeneralInformationsForm'
import { useSyncFormValuesWithRedux } from './hooks/useSyncFormValuesWithRedux'
import { useUpdateOtherControlTypes } from './hooks/useUpdateOtherControlTypes'
import { useUpdateSurveillance } from './hooks/useUpdateSurveillance'
import { MissionFormBottomBar } from './MissionFormBottomBar'
import { CancelEditModal } from './modals/CancelEditModal'
import { DeleteModal } from './modals/DeleteModal'
import { ReopenModal } from './modals/ReopenModal'
import { removeMissionListener } from './sse'
import { type Mission, MissionSourceEnum, type NewMission } from '../../../domain/entities/missions'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setToast } from '../../../domain/shared_slices/Global'
import { multiMissionsActions } from '../../../domain/shared_slices/MultiMissions'
import { deleteMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/deleteMission'
import { saveMission } from '../../../domain/use_cases/missions/saveMission'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { sideWindowActions } from '../../SideWindow/slice'
import { missionFactory } from '../Missions.helpers'

export function MissionForm({ id, isNewMission, selectedMission, setShouldValidateOnChange }) {
  const dispatch = useAppDispatch()
  const sideWindow = useAppSelector(state => state.sideWindow)
  const attachedReportingIds = useAppSelector(state => state.attachReportingToMission.attachedReportingIds)
  const attachedReportings = useAppSelector(state => state.attachReportingToMission.attachedReportings)
  const { dirty, setFieldValue, setValues, validateForm, values } = useFormikContext<Partial<Mission | NewMission>>()

  useSyncFormValuesWithRedux()
  useUpdateSurveillance()
  useUpdateOtherControlTypes()

  useEffect(() => {
    if (selectedMission) {
      setValues(missionFactory(selectedMission))
    }
  }, [setValues, selectedMission])

  const [currentActionIndex, setCurrentActionIndex] = useState<string | undefined>(undefined)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false)

  const allowEditMission =
    selectedMission?.missionSource === undefined ||
    selectedMission?.missionSource === MissionSourceEnum.MONITORENV ||
    selectedMission?.missionSource === MissionSourceEnum.MONITORFISH
  const allowDeleteMission = !isNewMission && allowEditMission
  const allowCloseMission = !selectedMission?.isClosed || !values?.isClosed

  // the form listens to the redux store to update the attached reportings
  // because of the map interaction to attach reportings
  useEffect(() => {
    if (attachedReportingIds.length !== values?.attachedReportingIds?.length) {
      setFieldValue('attachedReportingIds', attachedReportingIds)
      setFieldValue('attachedReportings', attachedReportings)
    }
  }, [attachedReportingIds, values?.attachedReportingIds?.length, setFieldValue, attachedReportings])

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
    removeMissionListener(id)
  }

  const submitMission = () => {
    setShouldValidateOnChange(false)

    validateForm().then(errors => {
      if (_.isEmpty(errors)) {
        dispatch(saveMission(values))

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  const closeMission = () => {
    validateForm({ ...values, isClosed: true }).then(errors => {
      if (_.isEmpty(errors)) {
        dispatch(saveMission({ ...values, isClosed: true }))

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  const reopenMission = () => {
    validateForm({ ...values, isClosed: false }).then(errors => {
      if (_.isEmpty(errors)) {
        setFieldValue('isClosed', false)
        if (dirty) {
          return setIsReopenModalOpen(true)
        }

        return validateReopenMission()
      }

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
          <ActionsForm currentActionIndex={currentActionIndex} setCurrentActionIndex={handleSetCurrentActionIndex} />
        </SecondColumn>
        <ThirdColumn>
          <ActionForm currentActionIndex={currentActionIndex} setCurrentActionIndex={handleSetCurrentActionIndex} />
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
  flex: 1;
`
