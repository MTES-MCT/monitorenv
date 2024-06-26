import { MapInteraction } from '@features/commonComponents/Modals/MapInteraction'
import { attachMissionToReportingSliceActions } from '@features/Reportings/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from 'domain/use_cases/map/updateMapInteractionListeners'
import styled from 'styled-components'

export function AttachMissionToReportingModal() {
  const dispatch = useAppDispatch()

  const isMissionAttachmentInProgress = useAppSelector(
    state => state.attachMissionToReporting.isMissionAttachmentInProgress
  )

  const initialAttachedMission = useAppSelector(state => state.attachMissionToReporting.initialAttachedMission)

  const resetMissionToAttach = () => {
    dispatch(attachMissionToReportingSliceActions.setAttachedMission(initialAttachedMission))
  }

  const validateMissionToAttach = () => {
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
  }

  if (!isMissionAttachmentInProgress) {
    return null
  }

  return (
    <MapInteraction
      onReset={resetMissionToAttach}
      onValidate={validateMissionToAttach}
      title="Vous êtes en train de lier ce signalement à une mission"
      validateButtonText="Lier à la mission"
    >
      <Text>Cliquez sur une mission en cours pour la sélectionner</Text>
    </MapInteraction>
  )
}

const Text = styled.p`
  padding-bottom: 16px;
`
