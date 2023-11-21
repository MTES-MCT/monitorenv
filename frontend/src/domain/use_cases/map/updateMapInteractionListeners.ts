import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
import { attachMissionToReportingSliceActions } from '../../../features/Reportings/ReportingForm/AttachMission/slice'
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
      dispatch(attachMissionToReportingSliceActions.setAttachMissionListener(false))
      dispatch(attachReportingToMissionSliceActions.setAttachReportingListener(false))
      break

    case MapInteractionListenerEnum.ATTACH_MISSION:
      dispatch(attachMissionToReportingSliceActions.setAttachMissionListener(true))
      dispatch(attachReportingToMissionSliceActions.setAttachReportingListener(false))
      dispatch(resetLayoutToDefault())
      dispatch(resetInteraction())
      break

    case MapInteractionListenerEnum.ATTACH_REPORTING:
      dispatch(attachReportingToMissionSliceActions.setAttachReportingListener(true))
      dispatch(attachMissionToReportingSliceActions.setAttachMissionListener(false))
      dispatch(resetLayoutToDefault())
      dispatch(resetInteraction())
      break

    case MapInteractionListenerEnum.NONE:
    default:
      dispatch(attachMissionToReportingSliceActions.setAttachMissionListener(false))
      dispatch(attachReportingToMissionSliceActions.setAttachReportingListener(false))
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
