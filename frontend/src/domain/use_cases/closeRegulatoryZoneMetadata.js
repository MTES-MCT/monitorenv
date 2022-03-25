import { closeRegulatoryMetadataPanel } from '../shared_slices/RegulatoryMetadata'

const closeRegulatoryZoneMetadata = () => dispatch => {
  dispatch(closeRegulatoryMetadataPanel())
}

export default closeRegulatoryZoneMetadata
