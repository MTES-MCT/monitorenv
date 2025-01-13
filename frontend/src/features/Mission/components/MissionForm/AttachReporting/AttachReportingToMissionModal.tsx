import { usePrevious } from '@mtes-mct/monitor-ui'
import { useEffect } from 'react'
import styled from 'styled-components'

import { attachReportingToMissionSliceActions } from './slice'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../../../domain/use_cases/map/updateMapInteractionListeners'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { getMissionPageRoute } from '../../../../../utils/routes'
import { MapInteraction } from '../../../../commonComponents/Modals/MapInteraction'

export function AttachReportingToMissionModal() {
  const dispatch = useAppDispatch()

  const isReportingAttachmentInProgress = useAppSelector(
    state => state.attachReportingToMission.isReportingAttachmentInProgress
  )
  const initialAttachedReportings = useAppSelector(state => state.attachReportingToMission.initialAttachedReportings)

  const sideWindow = useAppSelector(state => state.sideWindow)

  const routeParams = getMissionPageRoute(sideWindow.currentPath)

  const previousMissionId = usePrevious(routeParams?.params?.id)

  const resetReportingToAttach = () => {
    dispatch(attachReportingToMissionSliceActions.setAttachedReportings(initialAttachedReportings))
  }

  const validateReportingToAttach = () => {
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
  }

  const cancelReportingToAttach = () => {
    dispatch(attachReportingToMissionSliceActions.setAttachedReportings(initialAttachedReportings))
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
  }

  // Close modal when selected mission form is hidden
  useEffect(() => {
    if (previousMissionId && previousMissionId !== routeParams?.params?.id && isReportingAttachmentInProgress) {
      dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    }
  }, [isReportingAttachmentInProgress, dispatch, previousMissionId, routeParams])

  if (!isReportingAttachmentInProgress) {
    return null
  }

  return (
    <MapInteraction
      onCancel={cancelReportingToAttach}
      onReset={resetReportingToAttach}
      onValidate={validateReportingToAttach}
      title="Vous êtes en train de lier un signalement"
      validateButtonText="Lier à la mission"
    >
      <Text>Cliquez sur un/ des signalement(s) pour le(s) sélectionner</Text>
    </MapInteraction>
  )
}

const Text = styled.p`
  padding-bottom: 16px;
`
