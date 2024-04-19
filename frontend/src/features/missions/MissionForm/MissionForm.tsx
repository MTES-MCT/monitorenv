import { customDayjs, FormikEffect, usePrevious } from '@mtes-mct/monitor-ui'
import { useMissionEventContext } from 'context/useMissionEventContext'
import { useFormikContext } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { generatePath } from 'react-router'
import styled from 'styled-components'

import { ActionForm } from './ActionForm'
import { ActionsTimeLine } from './ActionsTimeLine'
import { CancelEditModal } from './CancelEditModal'
import { CloseEditModal } from './CloseEditModal'
import { DeleteModal } from './DeleteModal'
import { ExternalActionsModal } from './ExternalActionsModal'
import { FormikSyncMissionFields } from './FormikSyncMissionFields'
import { GeneralInformationsForm } from './GeneralInformationsForm'
import { useMissionAndActionsCompletion } from './hooks/useMissionAndActionsCompletion'
import { useSyncFormValuesWithRedux } from './hooks/useSyncFormValuesWithRedux'
import { useUpdateOtherControlTypes } from './hooks/useUpdateOtherControlTypes'
import { useUpdateSurveillance } from './hooks/useUpdateSurveillance'
import { MissionFormBottomBar } from './MissionFormBottomBar'
import { missionFormsActions } from './slice'
import { isMissionAutoSaveEnabled, validateBeforeOnChange } from './utils'
import { missionsAPI } from '../../../api/missionsAPI'
import { type Mission, MissionSourceEnum, type NewMission } from '../../../domain/entities/missions'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setToast } from '../../../domain/shared_slices/Global'
import { deleteMissionAndGoToMissionsList } from '../../../domain/use_cases/missions/deleteMission'
import { saveMission } from '../../../domain/use_cases/missions/saveMission'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { sideWindowActions } from '../../SideWindow/slice'

import type { ControlUnit } from '../../../domain/entities/controlUnit'
import type { AtLeast } from '../../../types'

enum ModalTypes {
  ACTIONS = 'ACTIONS',
  CLOSE = 'CLOSE',
  DELETE = 'DELETE'
}

type ModalProps = ModalTypes.ACTIONS | ModalTypes.DELETE | ModalTypes.CLOSE

type MissionFormProps = {
  engagedControlUnit: ControlUnit.EngagedControlUnit | undefined
  id: number | string
  isNewMission: boolean
  selectedMission: AtLeast<Partial<Mission>, 'id'> | Partial<NewMission> | undefined
  setShouldValidateOnChange: (boolean) => void
}

export function MissionForm({
  engagedControlUnit,
  id,
  isNewMission,
  selectedMission,
  setShouldValidateOnChange
}: MissionFormProps) {
  const dispatch = useAppDispatch()
  const sideWindow = useAppSelector(state => state.sideWindow)
  const attachedReportingIds = useAppSelector(state => state.attachReportingToMission.attachedReportingIds)
  const attachedReportings = useAppSelector(state => state.attachReportingToMission.attachedReportings)
  const selectedMissions = useAppSelector(state => state.missionForms.missions)
  const { getMissionEventById } = useMissionEventContext()
  const missionEvent = getMissionEventById(id)

  const {
    dirty,
    errors: formErrors,
    setFieldValue,
    validateForm,
    values
  } = useFormikContext<Partial<Mission | NewMission>>()

  const previousEngagedControlUnit = usePrevious(engagedControlUnit)

  const isAutoSaveEnabled = useMemo(() => {
    if (!isMissionAutoSaveEnabled()) {
      return false
    }
    const now = customDayjs()
    if (
      selectedMission?.endDateTimeUtc &&
      now.isAfter(selectedMission?.endDateTimeUtc) &&
      customDayjs(selectedMission?.endDateTimeUtc) < customDayjs(selectedMission?.endDateTimeUtc).add(2, 'days')
    ) {
      return false
    }

    return true
  }, [selectedMission])

  const isFormDirty = useMemo(() => selectedMissions[id]?.isFormDirty ?? false, [id, selectedMissions])

  useSyncFormValuesWithRedux(isAutoSaveEnabled)
  const { missionCompletionFrontStatus } = useMissionAndActionsCompletion()
  useUpdateSurveillance()
  useUpdateOtherControlTypes()

  const [currentActionIndex, setCurrentActionIndex] = useState<string | undefined>(undefined)
  const [openModal, setOpenModal] = useState<ModalProps | undefined>(undefined)
  const [actionsSources, setActionsSources] = useState<MissionSourceEnum[]>([])

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
    setOpenModal(undefined)
  }
  const validateDeleteMission = () => {
    dispatch(deleteMissionAndGoToMissionsList(id))
  }

  const deleteMission = async () => {
    try {
      const response = dispatch(missionsAPI.endpoints.canDeleteMission.initiate(Number(id)))
      const canDeleteMissionResponse = await response.unwrap()

      if (canDeleteMissionResponse.canDelete) {
        setOpenModal(ModalTypes.DELETE)

        return
      }

      setActionsSources(canDeleteMissionResponse.sources)
      setOpenModal(ModalTypes.ACTIONS)
    } catch (error: any) {
      dispatch(
        setToast({
          containerId: 'sideWindow',
          message: error.message,
          type: 'error'
        })
      )
    }
  }

  const cancelForm = async () => {
    await dispatch(sideWindowActions.setShowConfirmCancelModal(false))
    await dispatch(sideWindowActions.setCurrentPath(generatePath(sideWindowPaths.MISSIONS)))
    await dispatch(missionFormsActions.deleteSelectedMission(id))
  }

  const submitMission = () => {
    setShouldValidateOnChange(false)

    validateForm().then(errors => {
      if (isEmpty(errors)) {
        dispatch(saveMission(values, false, true))

        return
      }
      dispatch(sideWindowActions.setShowConfirmCancelModal(true))
      setShouldValidateOnChange(true)
    })
  }

  const confirmFormCancelation = () => {
    // when auto save is disabled, and form has changes we want to display specific modal
    if (!isAutoSaveEnabled && dirty && isEmpty(formErrors)) {
      setOpenModal(ModalTypes.CLOSE)

      return
    }
    if (isFormDirty) {
      dispatch(sideWindowActions.setShowConfirmCancelModal(true))
    } else {
      cancelForm()
    }
  }

  useEffect(() => {
    if (isNewMission && !engagedControlUnit && previousEngagedControlUnit !== engagedControlUnit) {
      validateBeforeOnChange(
        values,
        true,
        dispatch,
        validateForm,
        isAutoSaveEnabled,
        engagedControlUnit,
        selectedMission,
        missionEvent
      )
    }
    // we want to trigger the `validateBeforeOnChange` when engagedControlUnit change
    // so when user confirm mission creation even if the control unit is engaged
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewMission, engagedControlUnit])

  useEffect(() => {
    if (!isAutoSaveEnabled) {
      return
    }
    if (
      values?.updatedAtUtc &&
      !customDayjs(selectedMission?.updatedAtUtc).isSame(customDayjs(values?.updatedAtUtc), 'minutes')
    ) {
      setFieldValue('updatedAtUtc', selectedMission?.updatedAtUtc)

      return
    }

    if (missionEvent && !customDayjs(missionEvent.updatedAtUtc).isSame(customDayjs(values?.updatedAtUtc), 'minutes')) {
      setFieldValue('updatedAtUtc', missionEvent?.updatedAtUtc)
    }
    // we want to listen to `updatedAtUtc` after `saveMission` or when a mission event is received
    // there's no need to listen for changes in `values`, since `updatedAtUtc` is read-only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionEvent, selectedMission?.updatedAtUtc, isAutoSaveEnabled])

  return (
    <StyledFormContainer>
      <FormikEffect
        onChange={nextValues =>
          validateBeforeOnChange(
            nextValues,
            false,
            dispatch,
            validateForm,
            isAutoSaveEnabled,
            engagedControlUnit,
            selectedMission,
            missionEvent
          )
        }
      />
      <FormikSyncMissionFields missionId={id} />
      <CancelEditModal onCancel={returnToEdition} onConfirm={cancelForm} open={sideWindow.showConfirmCancelModal} />
      <CloseEditModal onCancel={returnToEdition} onConfirm={cancelForm} open={openModal === ModalTypes.CLOSE} />
      <DeleteModal
        onCancel={returnToEdition}
        onConfirm={validateDeleteMission}
        open={openModal === ModalTypes.DELETE}
      />
      <ExternalActionsModal
        onClose={returnToEdition}
        open={openModal === ModalTypes.ACTIONS}
        sources={actionsSources}
      />
      <Wrapper>
        <FirstColumn>
          <GeneralInformationsForm missionCompletion={missionCompletionFrontStatus} />
        </FirstColumn>
        <SecondColumn>
          <ActionsTimeLine
            currentActionIndex={currentActionIndex}
            setCurrentActionIndex={handleSetCurrentActionIndex}
          />
        </SecondColumn>
        <ThirdColumn>
          <ActionForm currentActionIndex={currentActionIndex} setCurrentActionIndex={handleSetCurrentActionIndex} />
        </ThirdColumn>
      </Wrapper>

      <MissionFormBottomBar
        isAutoSaveEnabled={isAutoSaveEnabled}
        onDeleteMission={deleteMission}
        onQuitFormEditing={confirmFormCancelation}
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
