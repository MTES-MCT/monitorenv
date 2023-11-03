import styled from 'styled-components'

import { attachReportingToMissionSliceActions } from './slice'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../../domain/use_cases/map/updateMapInteractionListeners'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { MapInteraction } from '../../../commonComponents/Modals/MapInteraction'

export function AttachReportingToMissionModal() {
  const dispatch = useAppDispatch()

  const attachReportingListener = useAppSelector(state => state.attachReportingToMission.attachReportingListener)
  const initialAttachedReportings = useAppSelector(state => state.attachReportingToMission.initialAttachedReportings)
  const initialAttachedReportingIds = useAppSelector(
    state => state.attachReportingToMission.initialAttachedReportingIds
  )

  const resetReportingToAttach = () => {
    dispatch(attachReportingToMissionSliceActions.setAttachedReportingIds(initialAttachedReportingIds))
    dispatch(attachReportingToMissionSliceActions.setAttachedReportings(initialAttachedReportings))
  }

  const validateReportingToAttach = () => {
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
  }

  if (!attachReportingListener) {
    return null
  }

  return (
    <MapInteraction
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
