import styled from 'styled-components'

import { attachMissionToReportingSliceActions } from './slice'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { MapInteraction } from '../../../commonComponents/Modals/MapInteraction'

export function SelectMissionModal() {
  const dispatch = useAppDispatch()
  const attachMissionListener = useAppSelector(state => state.attachReportingToMission.attachMissionListener)

  const initialAttachedMissionId = useAppSelector(state => state.attachReportingToMission.initialAttachedMissionId)
  const resetMissionToAttach = () => {
    dispatch(attachMissionToReportingSliceActions.setAttachedMissionId(initialAttachedMissionId))
  }

  const validateMissionToAttach = () => {
    dispatch(attachMissionToReportingSliceActions.setAttachMissionListener(false))
  }

  if (!attachMissionListener) {
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
