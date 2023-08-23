import type { Base } from '../../../domain/entities/base/types'

export function isBase(baseData: Base.BaseData): baseData is Base.Base {
  return baseData.id !== undefined
}
