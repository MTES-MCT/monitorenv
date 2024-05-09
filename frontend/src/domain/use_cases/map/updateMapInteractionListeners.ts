import { attachReportingToMissionSliceActions } from '@features/Mission/components/MissionForm/AttachReporting/slice'

import { attachMissionToReportingSliceActions } from '../../../features/Reportings/slice'
import { resetInteraction } from '../../shared_slices/Draw'
import { setDisplayedItems, resetLayoutToDefault } from '../../shared_slices/Global'

export enum MapInteractionListenerEnum {
  ATTACH_MISSION = 'ATTACH_MISSION',
  ATTACH_REPORTING = 'ATTACH_REPORTING',
  DRAW_ZONE_OR_POINT = 'DRAW_ZONE_OR_POINT',
  NONE = 'NONE'
}

export const updateMapInteractionListeners = (listener: MapInteractionListenerEnum) => dispatch => {
  switch (listener) {
    case MapInteractionListenerEnum.DRAW_ZONE_OR_POINT:
      openDrawLayerModal(dispatch)
      dispatch(attachMissionToReportingSliceActions.setIsMissionAttachmentInProgress(false))
      dispatch(attachReportingToMissionSliceActions.setIsReportingAttachmentInProgress(false))
      break

    case MapInteractionListenerEnum.ATTACH_MISSION:
      openDrawLayerModal(dispatch)
      dispatch(attachMissionToReportingSliceActions.setIsMissionAttachmentInProgress(true))
      dispatch(attachReportingToMissionSliceActions.setIsReportingAttachmentInProgress(false))
      dispatch(resetInteraction())
      break

    case MapInteractionListenerEnum.ATTACH_REPORTING:
      openDrawLayerModal(dispatch)
      dispatch(attachReportingToMissionSliceActions.setIsReportingAttachmentInProgress(true))
      dispatch(attachMissionToReportingSliceActions.setIsMissionAttachmentInProgress(false))
      dispatch(resetInteraction())
      break

    case MapInteractionListenerEnum.NONE:
    default:
      dispatch(attachMissionToReportingSliceActions.setIsMissionAttachmentInProgress(false))
      dispatch(attachReportingToMissionSliceActions.setIsReportingAttachmentInProgress(false))
      dispatch(resetLayoutToDefault())
      dispatch(resetInteraction())
      break
  }
}

const openDrawLayerModal = dispatch => {
  dispatch(
    setDisplayedItems({
      displayDrawModal: true,
      displayInterestPoint: false,
      displayLayersSidebar: false,
      displayLocateOnMap: true,
      displayMeasurement: false,
      displayMissionMenuButton: false,
      displayReportingsButton: false,
      displayReportingsOverlay: false,
      displayRightMenuControlUnitListButton: false,
      displaySearchSemaphoreButton: false
    })
  )
}
