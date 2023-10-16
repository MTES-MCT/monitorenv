import { omit } from 'lodash/fp'

import type { BaseFormValues } from './types'
import type { Base } from '../../../../domain/entities/base'

export function getBaseDataFromBaseFormValues(baseFormValues: BaseFormValues): Base.BaseData {
  return {
    ...omit(['coordinates'], baseFormValues),
    latitude: baseFormValues.coordinates![0],
    longitude: baseFormValues.coordinates![1]
  } as Base.BaseData
}

export function getBaseFormValuesFromBase(base: Base.Base): BaseFormValues {
  return {
    ...base,
    coordinates: [base.latitude, base.longitude]
  }
}

export function isBase(baseData: Base.BaseData): baseData is Base.Base {
  return baseData.id !== undefined
}
