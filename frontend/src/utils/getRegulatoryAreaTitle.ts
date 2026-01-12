import { getTitle } from 'domain/entities/layers/utils'

export function getRegulatoryAreaTitle(polyName: string | undefined, resume: string | undefined): string | undefined {
  return getTitle(polyName && polyName.length > 0 ? polyName : resume)
}
