import * as Comlink from 'comlink'
import {
  getMergedRegulatoryLayers,
  LAWTYPES_TO_TERRITORY,
  mapToRegulatoryZone,
  orderByAlphabeticalLayer,
  searchByLawType,
  FRANCE
} from '../domain/entities/regulatory'

class MonitorFishWorker {
  #getLayerTopicList = features => {
    const featuresWithoutGeometry = features.features.map(feature => {
      return mapToRegulatoryZone(feature)
    })

    const uniqueFeaturesWithoutGeometry = featuresWithoutGeometry.reduce((acc, current) => {
      const found = acc.find(item =>
        item.topic === current.topic &&
        item.zone === current.zone)
      if (!found) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [])

    return uniqueFeaturesWithoutGeometry
      .map(layer => layer.topic)
      .map(topic => {
        return uniqueFeaturesWithoutGeometry.filter(layer => layer.topic === topic)
      })
  }

  #getGeometryIdFromFeatureId = feature => {
    return feature.vesselProperties?.id || feature.id.split('.')[1]
  }

  getGeometryWithoutRegulationRef (features) {
    const geometryListAsObject = {}
    features.features.forEach(feature => {
      geometryListAsObject[this.#getGeometryIdFromFeatureId(feature)] = feature.geometry
    })
    return geometryListAsObject
  }

  convertGeoJSONFeaturesToObject (features) {
    const layerTopicsArray = this.#getLayerTopicList(features)
    const layersTopicsToZones = layerTopicsArray.reduce((accumulatedObject, zone) => {
      accumulatedObject[zone[0].topic] = zone
      return accumulatedObject
    }, {})

    return layersTopicsToZones
  }

  /**
   * Get all regulatory data structured as
   * Territory: {
   *  LawType: {
   *    Topic: Zone[]
   *  }
   * }
   * (see example)
   * @param {GeoJSON} features
   * @returns {Object} The structured regulatory data
   * @example
   * "France": {
   *    "Reg locale / NAMO": {
   *       "Armor_CSJ_Dragues": [
   *         {
   *           bycatch: undefined,
   *           closingDate: undefined,
   *           deposit: undefined,
   *           lawType: "Reg locale",
   *           mandatoryDocuments: undefined,
   *           obligations: undefined,
   *           openingDate: undefined,
   *           period: undefined,
   *           permissions: undefined,
   *           prohibitions: undefined,
   *           quantity: undefined,
   *           region: "Bretagne",
   *           regulatoryReferences: "[
   *             {\"url\": \"http://legipeche.metier.i2/arrete-prefectoral-r53-2020-04-24-002-delib-2020-a9873.html?id_rub=1637\",
   *             \"reference\": \"ArrÃªtÃ© PrÃ©fectoral R53-2020-04-24-002 - dÃ©lib 2020-004 / NAMO\"}, {\"url\": \"\", \"reference\": \"126-2020\"}]",
   *           rejections: undefined,
   *           size: undefined,
   *           state: undefined,
   *           technicalMeasurements: undefined,
   *           topic: "Armor_CSJ_Dragues",
   *           zone: "Secteur 3"
   *         }
   *       ]
   *       "GlÃ©nan_CSJ_Dragues": (1) […],
   *       "Bretagne_Laminaria_Hyperborea_Scoubidous - 2019": (1) […],
   *    },
   *     "Reg locale / Sud-Atlantique, SA": {
   *       "Embouchure_Gironde": (1) […],
   *       "Pertuis_CSJ_Dragues": (6) […],
   *       "SA_Chaluts_Pelagiques": (5) […]
   *     }
   * }
   */
  convertGeoJSONFeaturesToStructuredRegulatoryObject (features) {
    const regulatoryTopicList = new Set()
    const layerTopicArray = this.#getLayerTopicList(features)
    const layersTopicsByRegulatoryTerritory = layerTopicArray.reduce((accumulatedObject, zone) => {
      const {
        lawType,
        topic
      } = zone[0]

      if (topic && lawType) {
        regulatoryTopicList.add(topic)
        const regulatoryTerritory = LAWTYPES_TO_TERRITORY[lawType]
        if (regulatoryTerritory) {
          if (!accumulatedObject[regulatoryTerritory]) {
            accumulatedObject[regulatoryTerritory] = {}
          }
          if (!accumulatedObject[regulatoryTerritory][lawType]) {
            accumulatedObject[regulatoryTerritory][lawType] = {}
          }
          let orderZoneList = zone
          if (zone.length > 1) {
            orderZoneList = zone.sort((a, b) => a.zone > b.zone ? 1 : a.zone === b.zone ? 0 : -1)
          }
          accumulatedObject[regulatoryTerritory][lawType][topic] = orderZoneList
        }
      }
      return accumulatedObject
    }, {})

    const orderedFrenchLayersTopics = {}
    Object.keys(LAWTYPES_TO_TERRITORY).forEach(lawType => {
      const lawTypeObject = layersTopicsByRegulatoryTerritory[FRANCE][lawType]
      if (lawTypeObject) {
        orderedFrenchLayersTopics[lawType] = lawTypeObject
      }
      return null
    })
    layersTopicsByRegulatoryTerritory[FRANCE] = orderedFrenchLayersTopics

    return layersTopicsByRegulatoryTerritory
  }


  searchLayers (searchFields, regulatoryLayers) {
    let foundRegulatoryLayers = {}

    Object.keys(searchFields).forEach(searchProperty => {
      if (searchFields[searchProperty].searchText.length > 0) {
        const searchResultByLawType = searchByLawType(
          regulatoryLayers,
          searchFields[searchProperty].properties,
          searchFields[searchProperty].searchText)

        if (foundRegulatoryLayers && Object.keys(foundRegulatoryLayers).length === 0) {
          foundRegulatoryLayers = searchResultByLawType
        } else if (foundRegulatoryLayers) {
          foundRegulatoryLayers = getMergedRegulatoryLayers(foundRegulatoryLayers, searchResultByLawType)
        }
      }
    })

    orderByAlphabeticalLayer(foundRegulatoryLayers)

    return foundRegulatoryLayers
  }
}

Comlink.expose(MonitorFishWorker)
