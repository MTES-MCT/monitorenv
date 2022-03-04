import * as Comlink from 'comlink'

import Worker from 'worker-loader!../../workers/MonitorFishWorker'
import { getExtentFromGeoJSON } from '../../utils/utils'
import { getRegulatoryZonesInExtentFromAPI } from '../../api/fetch'
import { getRegulatoryLayersWithoutTerritory } from '../entities/regulatory'

const worker = new Worker()
const MonitorFishWorker = Comlink.wrap(worker)

/**
 * Search for regulatory zones in the regulatory referential, by zone (geometry) and by the input filters
 * @function searchRegulatoryLayers
 * @param {Object} searchFields
 * @param {boolean} inputsAreEmpty
 * @return {Object} - Return the found regulatory zones
 */
const searchRegulatoryLayers = (searchFields, inputsAreEmpty) => {
  return async (dispatch, getState) => {
    const worker = await new MonitorFishWorker()
    const state = getState()
    const {
      regulatoryLayers
    } = state.regulatory
    const {
      zoneSelected
    } = state.regulatoryLayerSearch

    let extent = []
    if (zoneSelected) {
      extent = getExtentFromGeoJSON(zoneSelected.feature)
    }

    if (extent?.length === 4) {
      return getRegulatoryZonesInExtentFromAPI(extent, false)
        .then(features => worker.convertGeoJSONFeaturesToStructuredRegulatoryObject(features))
        .then(regulatoryLayers => getRegulatoryLayersWithoutTerritory(regulatoryLayers))
        .then(filteredRegulatoryLayers => {
          if (inputsAreEmpty) {
            return filteredRegulatoryLayers
          }

          return worker.searchLayers(searchFields, filteredRegulatoryLayers, state.gear.gears)
        })
    }

    return worker.searchLayers(searchFields, regulatoryLayers, state.gear.gears)
  }
}

export default searchRegulatoryLayers
