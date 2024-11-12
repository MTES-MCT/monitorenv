import * as Comlink from 'comlink'
import { groupBy } from 'lodash'

/**
 * /!\ Do not shorten imports in the Web worker.
 * It will fail the Vite build : `Rollup failed to resolve import [...]`
 */

export class MonitorEnvWebWorker {
  static getAMPsGroupByName(filteredAmps, amps) {
    return groupBy(filteredAmps, a => amps?.entities[a]?.name)
  }

  static getRegulatoryLayersByLayerName(filteredRegulatoryAreas, regulatoryLayers) {
    return groupBy(filteredRegulatoryAreas, r => regulatoryLayers?.entities[r]?.layer_name)
  }
}

Comlink.expose(MonitorEnvWebWorker)
