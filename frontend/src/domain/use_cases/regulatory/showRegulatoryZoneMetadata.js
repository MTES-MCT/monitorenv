import { openRegulatoryMetadataPanel } from '../../shared_slices/RegulatoryMetadata'

export const showRegulatoryZoneMetadata = regulatoryMetadataLayerId => dispatch => {
  if (regulatoryMetadataLayerId) {
    dispatch(openRegulatoryMetadataPanel(regulatoryMetadataLayerId))
  }
}
