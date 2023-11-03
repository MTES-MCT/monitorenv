import { attachMissionToReportingSliceActions } from '../../../features/Reportings/ReportingForm/AttachMission/slice'
import { InteractionListener, InteractionType } from '../../entities/map/constants'
import { setGeometry, setInitialGeometry, setInteractionTypeAndListener } from '../../shared_slices/Draw'
import { setDisplayedItems } from '../../shared_slices/Global'

import type { GeoJSON as GeoJSONNamespace } from '../../types/GeoJSON'

export const drawPolygon =
  (geometry: GeoJSONNamespace.Geometry | undefined, listener: InteractionListener) => dispatch => {
    if (geometry) {
      dispatch(setGeometry(geometry))
      dispatch(setInitialGeometry(geometry))
    }

    // we want to close the other MapIntercation Modal
    dispatch(attachMissionToReportingSliceActions.setAttachMissionListener(false))
    dispatch(openDrawLayerModal)
    dispatch(
      setInteractionTypeAndListener({
        listener,
        type: InteractionType.POLYGON
      })
    )
  }

export const drawPoint =
  (geometry: GeoJSONNamespace.Geometry | undefined, listener?: InteractionListener) => dispatch => {
    if (geometry) {
      dispatch(setGeometry(geometry))
      dispatch(setInitialGeometry(geometry))
    }

    // we want to close the other MapIntercation Modal
    dispatch(attachMissionToReportingSliceActions.setAttachMissionListener(false))
    dispatch(openDrawLayerModal)
    dispatch(
      setInteractionTypeAndListener({
        listener: listener || InteractionListener.CONTROL_POINT,
        type: InteractionType.POINT
      })
    )
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
      displayReportingsOverlay: false,
      displaySearchSemaphoreButton: false
    })
  )
}

export const closeDrawLayerModal = dispatch => {
  dispatch(
    setDisplayedItems({
      displayDrawModal: false,
      displayInterestPoint: true,
      displayLayersSidebar: true,
      displayLocateOnMap: true,
      displayMeasurement: true,
      displayMissionMenuButton: true,
      displayReportingsOverlay: true,
      displaySearchSemaphoreButton: true
    })
  )
}
