import { formatDataForSelectPicker, getTextForSearch } from '../../utils/utils'
import Layers from './layers'

export const mapToRegulatoryZone = ({ properties, geometry, id }) => {
  return {
    id: properties.id || id?.split('.')[1],
    geometry: geometry,
    lawType: properties.law_type,
    topic: properties.layer_name,
    zone: decodeURI(properties.zones),
    regulatoryReferences: parseRegulatoryReferences(properties.references_reglementaires),
    upcomingRegulatoryReferences: parseUpcomingRegulatoryReferences(properties.references_reglementaires_a_venir),
    permissions: properties.autorisations,
    bycatch: properties.captures_accessoires,
    openingDate: properties.date_ouverture,
    closingDate: properties.date_fermeture,
    mandatoryDocuments: properties.documents_obligatoires,
    state: properties.etat,
    prohibitions: properties.interdictions,
    technicalMeasurements: properties.mesures_techniques,
    period: properties.periodes,
    quantity: properties.quantites,
    size: properties.taille,
    region: properties.region,
    obligations: properties.obligations,
    rejections: properties.rejets,
    deposit: properties.gisement
  }
}


const parseUpcomingRegulatoryReferences = upcomingRegulatoryReferences =>
  upcomingRegulatoryReferences && upcomingRegulatoryReferences !== {}
    ? parseJSON(upcomingRegulatoryReferences)
    : undefined

const parseRegulatoryReferences = regulatoryTextsString => {
  if (!regulatoryTextsString) {
    return undefined
  }

  const regulatoryTexts = parseJSON(regulatoryTextsString)
  if (regulatoryTexts?.length > 0 && Array.isArray(regulatoryTexts)) {
    return regulatoryTexts.map(regulatoryText => {
      if (!regulatoryText.startDate || regulatoryText.startDate === '') {
        regulatoryText.startDate = new Date().getTime()
      }

      return regulatoryText
    })
  }

  return undefined
}

const parseJSON = text => typeof text === 'string'
  ? JSON.parse(text)
  : text


export const mapToRegulatoryFeatureObject = properties => {
  const {
    layerName,
    lawType,
    zone,
    region,
    regulatoryReferences,
    upcomingRegulatoryReferences,
  } = properties

  return {
    layer_name: layerName,
    law_type: lawType,
    zones: zone,
    region,
    references_reglementaires: JSON.stringify(regulatoryReferences),
    references_reglementaires_a_venir: JSON.stringify(upcomingRegulatoryReferences),
  }
}

export const getRegulatoryFeatureId = (id) => {
  return `${Layers.REGULATORY.code}_write.${id}`
}

export const emptyRegulatoryFeatureObject = {
  layer_name: null,
  law_type: null,
  zones: null,
  region: null,
  references_reglementaires: null,
  references_reglementaires_a_venir: null
}

export const FRANCE = 'Réglementation France'
export const UE = 'Réglementation UE'
export const REG_LOCALE = 'Reg locale'

const REG_MED = 'Reg. MED'
const REG_SA = 'Reg. SA'
const REG_NAMO = 'Reg. NAMO'
const REG_MEMN = 'Reg. MEMN'
const REG_OUTRE_MER = 'Reg. Outre-mer'
const RUE_2019 = 'R(UE) 2019/1241'
const RUE_1380 = 'R(UE) 1380/2013'
const RUE_494 = 'R(CE) 494/2002'

export const LAWTYPES_TO_TERRITORY = {
  [REG_MED]: FRANCE,
  [REG_SA]: FRANCE,
  [REG_NAMO]: FRANCE,
  [REG_MEMN]: FRANCE,
  [REG_OUTRE_MER]: FRANCE,
  [RUE_2019]: UE,
  [RUE_1380]: UE,
  [RUE_494]: UE
}

export const REGULATORY_TERRITORY = {
  [FRANCE]: 'Réglementation France',
  [UE]: 'Réglementation UE'
}

export const REGULATORY_SEARCH_PROPERTIES = {
  TOPIC: 'topic',
  ZONE: 'zone',
  REGION: 'region',
  REGULATORY_REFERENCES: 'regulatoryReferences'
}

/**
  * @readonly
  * @enum {string}
*/
export const REGULATION_ACTION_TYPE = {
  UPDATE: 'update',
  INSERT: 'insert',
  DELETE: 'delete'
}

/**
  * @readonly
  * @enum {RegulatoryTextSource}
*/
export const REGULATORY_TEXT_SOURCE = {
  UPCOMING_REGULATION: 'upcomingRegulation',
  REGULATION: 'regulation'
}

/**
* @enum {RegulatoryTextType}
*/
export const REGULATORY_TEXT_TYPE = {
  CREATION: 'creation',
  REGULATION: 'regulation'
}

const regulatoryZoneTextType = type =>
  type === REGULATORY_TEXT_TYPE.CREATION ? 'création' : REGULATORY_TEXT_TYPE.REGULATION ? 'réglementation' : undefined

export const getRegulatoryZoneTextTypeAsText = (textTypeList) => {
  return `${textTypeList.length === 2
  ? `${regulatoryZoneTextType(textTypeList[0])} et ${regulatoryZoneTextType(textTypeList[1])}`
  : `${regulatoryZoneTextType(textTypeList[0])}`} de zone`
}

export const DEFAULT_REGULATORY_TEXT = {
  url: '',
  reference: '',
  startDate: new Date().getTime(),
  endDate: undefined,
  textType: []
}

export const DEFAULT_DATE_RANGE = {
  startDate: undefined,
  endDate: undefined
}

export const WEEKDAYS = {
  lundi: 'L',
  mardi: 'M',
  mercredi: 'M',
  jeudi: 'J',
  vendredi: 'V',
  samedi: 'S',
  dimanche: 'D'
}

export const DEFAULT_MENU_CLASSNAME = 'new-regulation-select-picker'

export function findIfSearchStringIncludedInProperty (zone, propertiesToSearch, searchText) {
  return zone[propertiesToSearch] && searchText
    ? getTextForSearch(zone[propertiesToSearch]).includes(getTextForSearch(searchText))
    : false
}

export function searchResultIncludeZone (searchResult, { lawType, topic, zone }) {
  const territorySearchResult = searchResult[LAWTYPES_TO_TERRITORY[lawType]]
  if (territorySearchResult) {
    return Object.keys(territorySearchResult).includes(lawType) &&
      Object.keys(territorySearchResult[lawType]).includes(topic) &&
      territorySearchResult[lawType][topic].filter(regulatoryZone => regulatoryZone.zone === zone).length > 0
  }
  return false
}


export function search (searchText, propertiesToSearch, regulatoryZones) {
  if (regulatoryZones) {
    const foundRegulatoryZones = { ...regulatoryZones }


    Object.keys(foundRegulatoryZones)
      .forEach(key => {
        foundRegulatoryZones[key] = foundRegulatoryZones[key]
          .filter(zone => {
            let searchStringIncludedInProperty = false
            propertiesToSearch.forEach(property => {
                searchStringIncludedInProperty =
                  searchStringIncludedInProperty || findIfSearchStringIncludedInProperty(zone, property, searchText)
            })
            return searchStringIncludedInProperty
          })
        if (!foundRegulatoryZones[key] || !foundRegulatoryZones[key].length > 0) {
          delete foundRegulatoryZones[key]
        }
      })

    return foundRegulatoryZones
  }
}



export function orderByAlphabeticalLayer (foundRegulatoryLayers) {
  if (foundRegulatoryLayers) {
    Object.keys(foundRegulatoryLayers).forEach(lawType => {
      Object.keys(foundRegulatoryLayers[lawType]).forEach(topic => {
        foundRegulatoryLayers[lawType][topic] = foundRegulatoryLayers[lawType][topic].sort((a, b) => {
          if (a.zone && b.zone) {
            return a.zone.localeCompare(b.zone)
          }

          return null
        })
      })
    })
  }
}

export function getMergedRegulatoryLayers (previousFoundRegulatoryLayers, nextFoundRegulatoryLayers) {
  const mergedRegulatoryLayers = {}

  Object.keys(previousFoundRegulatoryLayers).forEach(lawType => {
    if (previousFoundRegulatoryLayers[lawType]) {
      Object.keys(previousFoundRegulatoryLayers[lawType]).forEach(regulatoryTopic => {
        previousFoundRegulatoryLayers[lawType][regulatoryTopic].forEach(zone => {
          if (nextFoundRegulatoryLayers &&
            nextFoundRegulatoryLayers[lawType] &&
            nextFoundRegulatoryLayers[lawType][regulatoryTopic] &&
            nextFoundRegulatoryLayers[lawType][regulatoryTopic].length &&
            nextFoundRegulatoryLayers[lawType][regulatoryTopic].some(searchZone =>
              searchZone.topic === zone.topic &&
              searchZone.zone === zone.zone
            )) {
            if (mergedRegulatoryLayers[lawType] && mergedRegulatoryLayers[lawType][regulatoryTopic]) {
              mergedRegulatoryLayers[lawType][regulatoryTopic] = mergedRegulatoryLayers[lawType][regulatoryTopic].concat(zone)
            } else {
              if (!mergedRegulatoryLayers[lawType]) {
                mergedRegulatoryLayers[lawType] = {}
              }
              mergedRegulatoryLayers[lawType][regulatoryTopic] = [].concat(zone)
            }
          }
        })
      })
    }
  })

  return mergedRegulatoryLayers
}


const getHoursValues = () => {
  const hours = [...Array(24).keys()]
  const times = hours.reduce((acc, hour) => {
    const hourStr = hour < 10 ? '0' + hour : hour
    acc.push(`${hourStr}h00`)
    acc.push(`${hourStr}h30`)
    return acc
  }, [])
  return formatDataForSelectPicker(times)
}

export const TIMES_SELECT_PICKER_VALUES = getHoursValues()

/**
 * timeToString
 * Convert date time to string
 * 0 is added in front of number lesser than 10
 * @param {Date} date
 * @returns {string} date as string
 */
export const convertTimeToString = (date) => {
  if (date) {
    const minutes = date.getMinutes()
    const hours = date.getHours()
    return `${hours < 10 ? '0' + hours : hours}h${minutes === 0 ? minutes + '0' : minutes}`
  }
}


export const getTitle = topic => topic ? `${topic?.replace(/[_]/g, ' ')}` : ''

/**
 * @function checkUrl
 * @param {String} url
 * @returns true if the url parameter is a correct url, else false
 */
export const checkURL = (_url) => {
  const regex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/
  return regex.test(_url)
}
