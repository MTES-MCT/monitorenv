import * as Comlink from 'comlink'
import { groupBy } from 'lodash'
import { createEmpty } from 'ol/extent'

import { getExtentOfLayersGroup } from '../features/layersSelector/utils/getExtentOfLayersGroup'

import type { EntityId } from '@reduxjs/toolkit'
import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

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

  static getRegulatoryLayersIdsGroupedByName(regulatoryLayers) {
    const regulatoryLayersIdsByName = {}
    const regulatoryLayersEntities = regulatoryLayers?.entities
    const regulatoryLayersIds = regulatoryLayers?.ids
    if (regulatoryLayersIds && regulatoryLayersEntities) {
      return regulatoryLayersIds?.reduce((acc, layerId) => {
        const name = regulatoryLayersEntities[layerId]?.layer_name
        if (name) {
          acc[name] = [...(acc[name] ?? []), layerId]
        }

        return acc
      }, {} as { [key: string]: EntityId[] })
    }

    return regulatoryLayersIdsByName
  }

  static getExtentOfRegulatoryLayersGroupByGroupName(groupName, regulatoryAreas) {
    const regulatoryLayersIdsGroupedByName = MonitorEnvWebWorker.getRegulatoryLayersIdsGroupedByName(regulatoryAreas)
    const layerIdsByGroupName = regulatoryLayersIdsGroupedByName[groupName]

    const amps = layerIdsByGroupName
      ?.map(id => regulatoryAreas.entities[id])
      .filter((amp): amp is RegulatoryLayerCompact => !!amp)
    if (amps) {
      return getExtentOfLayersGroup(amps)
    }

    return createEmpty()
  }
}

Comlink.expose(MonitorEnvWebWorker)
