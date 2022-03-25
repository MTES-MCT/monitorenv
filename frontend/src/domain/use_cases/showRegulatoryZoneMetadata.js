
import {
  openRegulatoryMetadataPanel,
} from '../shared_slices/RegulatoryMetadata'

const showRegulatoryZoneMetadata = regulatoryMetadataLayerId => (dispatch) => {
  if (regulatoryMetadataLayerId) {
    dispatch(openRegulatoryMetadataPanel(regulatoryMetadataLayerId))
    
  }
}

export default showRegulatoryZoneMetadata
