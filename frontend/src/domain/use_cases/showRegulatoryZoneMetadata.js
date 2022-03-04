import { batch } from 'react-redux'

import { getRegulatoryFeatureMetadataFromAPI } from '../../api/fetch'
import {
  closeRegulatoryZoneMetadataPanel,
  resetLoadingRegulatoryZoneMetadata,
  setLoadingRegulatoryZoneMetadata,
  setRegulatoryZoneMetadata
} from '../shared_slices/Regulatory'
import { mapToRegulatoryZone } from '../entities/regulatory'
import { setError } from '../shared_slices/Global'

const showRegulatoryZoneMetadata = regulatoryZone => (dispatch, getState) => {
  if (regulatoryZone) {
    dispatch(setLoadingRegulatoryZoneMetadata())
    getRegulatoryFeatureMetadataFromAPI(regulatoryZone, getState().global.inBackofficeMode).then(feature => {
      const regulatoryZoneMetadata = mapToRegulatoryZone(feature)
      dispatch(setRegulatoryZoneMetadata(regulatoryZoneMetadata))
    }).catch(error => {
      console.error(error)
      batch(() => {
        dispatch(closeRegulatoryZoneMetadataPanel())
        dispatch(setError(error))
        dispatch(resetLoadingRegulatoryZoneMetadata())
      })
    })
  }
}

export default showRegulatoryZoneMetadata
