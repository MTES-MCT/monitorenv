import type { Base } from '../../../domain/entities/Base/types'

export function isBase(baseData: Base.BaseData): baseData is Base.Base {
  return baseData.id !== undefined
}
