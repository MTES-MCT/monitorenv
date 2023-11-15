import { closeRegulatoryMetadataPanel } from '../../shared_slices/RegulatoryMetadata'

export const closeRegulatoryZoneMetadata = () => dispatch => {
  dispatch(closeRegulatoryMetadataPanel())
}
