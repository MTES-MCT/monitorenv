import type { Base } from '../../../domain/entities/base'

export function isBase(baseData: Base.BaseData): baseData is Base.Base {
  return baseData.id !== undefined
}
