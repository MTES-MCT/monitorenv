import { chain } from 'lodash'

import type { Option } from '@mtes-mct/monitor-ui'
import type { AMP } from 'domain/entities/AMPs'

export function getAmpsAsOptions(amps: AMP[]): Option[] {
  if (!amps) {
    return []
  }

  return chain(amps)
    .map(l => l?.type?.trim())
    .uniq()
    .filter(l => !!l)
    .map(l => ({ label: l, value: l }))
    .sortBy('label')
    .value() as Option[]
}
