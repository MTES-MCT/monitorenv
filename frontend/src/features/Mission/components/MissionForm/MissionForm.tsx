import {
  Banner,
  FormikEffect,
  Icon,
  Level,
  THEME,
  customDayjs,
  usePrevious,
  type ControlUnit
} from '@mtes-mct/monitor-ui'
import { useMissionEventContext } from 'context/mission/useMissionEventContext'
import { useFormikContext } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { generatePath } from 'react-router'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import { ActionForm } from './ActionForm'
import { ActionsTimeLine } from './ActionsTimeLine'
import { CancelEditModal } from './CancelEditModal'
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
import { getIsMissionFormValid, isMissionAutoSaveEnabled, shouldSaveMission } from './utils'
import { missionsAPI } from '../../../../api/missionsAPI'
import {
  FrontCompletionStatus,
  MissionSourceEnum,
  type Mission,
  type NewMission
} from '../../../../domain/entities/missions'
import { sideWindowPaths } from '../../../../domain/entities/sideWindow'
import { setToast } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { sideWindowActions } from '../../../SideWindow/slice'
import { deleteMissionAndGoToMissionsList } from '../../useCases/deleteMission'
import { saveMission } from '../../useCases/saveMission'
import { getIsMissionEnded } from '../../utils'

import type { AtLeast } from '../../../../types'

enum ModalTypes {
  ACTIONS = 'ACTIONS',
  DELETE = 'DELETE'
}

type ModalProps = ModalTypes.ACTIONS | ModalTypes.DELETE

type MissionFormProps = {
  activeActionId: string | undefined
  engagedControlUnit: ControlUnit.EngagedControlUnit | undefined
  id: number | string
  isNewMission: boolean
  selectedMission: AtLeast<Partial<Mission>, 'id'> | Partial<NewMission> | undefined
}

export function MissionForm({
  activeActionId,
  engagedControlUnit,
  id,
  isNewMission,
  selectedMission
}: MissionFormProps) {
  const dispatch = useAppDispatch()

  const sideWindow = useAppSelector(state => state.sideWindow)
  const attachedReportingIds = useAppSelector(state => state.attachReportingToMission.attachedReportingIds)
  const attachedReportings = useAppSelector(state => state.attachReportingToMission.attachedReportings)
  const selectedMissions = useAppSelector(state => state.missionForms.missions)

  const { getMissionEventById } = useMissionEventContext()
  const missionEvent = getMissionEventById(id)

  const { dirty, setFieldValue, values } = useFormikContext<Partial<Mission | NewMission>>()

  const previousEngagedControlUnit = usePrevious(engagedControlUnit)

  const isAutoSaveEnabled = useMemo(() => {
    if (!isMissionAutoSaveEnabled()) {
      return false
    }

    const isMissionEnded = getIsMissionEnded(selectedMission?.endDateTimeUtc)
    const now = customDayjs()
    if (isMissionEnded && selectedMission && now.subtract(48, 'hours').isAfter(selectedMission.endDateTimeUtc)) {
      return false
    }

    return true
  }, [selectedMission])

  const isFormDirty = useMemo(() => selectedMissions[id]?.isFormDirty ?? false, [id, selectedMissions])

  useSyncFormValuesWithRedux(isAutoSaveEnabled)
  const { missionCompletionFrontStatus } = useMissionAndActionsCompletion()
  useUpdateSurveillance()
  useUpdateOtherControlTypes()

  const [openModal, setOpenModal] = useState<ModalProps | undefined>(undefined)
  const [actionsSources, setActionsSources] = useState<MissionSourceEnum[]>([])

  const isMissionFormValid = useMemo(() => getIsMissionFormValid(values), [values])

  // the form listens to the redux store to update the attached reportings
  // because of the map interaction to attach reportings
  useEffect(() => {
    if (attachedReportingIds.length !== values?.attachedReportingIds?.length) {
      setFieldValue('attachedReportingIds', attachedReportingIds)
      setFieldValue('attachedReportings', attachedReportings)
    }
  }, [attachedReportingIds, values?.attachedReportingIds?.length, setFieldValue, attachedReportings])

  const handleSetCurrentActionId = (actionId: string | undefined) => {
    dispatch(missionFormsActions.setActiveActionId(actionId))
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

  const submitMission = async () => {
    if (isMissionFormValid) {
      dispatch(saveMission(values, false, true))

      return
    }

    dispatch(sideWindowActions.setShowConfirmCancelModal(true))
  }

  const confirmFormCancelation = () => {
    if ((!isAutoSaveEnabled && dirty && isMissionFormValid) || isFormDirty) {
      dispatch(sideWindowActions.setShowConfirmCancelModal(true))
    } else {
      cancelForm()
    }
  }

  const validateBeforeOnChange = useDebouncedCallback(async (nextValues, forceSave) => {
    if ((!isAutoSaveEnabled || engagedControlUnit) ?? !isMissionFormValid) {
      return
    }

    if (!shouldSaveMission(selectedMission, missionEvent, nextValues) && !forceSave) {
      return
    }

    dispatch(saveMission(nextValues, false, false))
  }, 300)

  useEffect(() => {
    if (isNewMission && !engagedControlUnit && previousEngagedControlUnit !== engagedControlUnit) {
      validateBeforeOnChange(values, true)
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
      {missionCompletionFrontStatus === FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED && (
        <Banner
          closingDelay={10000}
          isClosable={false}
          isCollapsible
          isHiddenByDefault={false}
          level={Level.ERROR}
          top="0"
          withAutomaticClosing
        >
          <MissionEndedText>
            <Icon.AttentionFilled color={THEME.color.maximumRed} />
            Veuillez compléter ou corriger les éléments en rouge
          </MissionEndedText>
        </Banner>
      )}

      <FormikEffect onChange={nextValues => validateBeforeOnChange(nextValues, false)} />
      <FormikSyncMissionFields missionId={id} />
      <CancelEditModal
        isAutoSaveEnabled={isAutoSaveEnabled}
        isDirty={dirty}
        isMissionFormValid={isMissionFormValid}
        onCancel={returnToEdition}
        onConfirm={cancelForm}
        open={sideWindow.showConfirmCancelModal}
      />
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
          <ActionsTimeLine currentActionId={activeActionId} setCurrentActionId={handleSetCurrentActionId} />
        </SecondColumn>
        <ThirdColumn>
          <ActionForm currentActionId={activeActionId} setCurrentActionId={handleSetCurrentActionId} />
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
const MissionEndedText = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: center;
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
  max-width: 33%;
`
