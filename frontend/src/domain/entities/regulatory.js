import { formatDataForSelectPicker } from '../../utils/utils'


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
