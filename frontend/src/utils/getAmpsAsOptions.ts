import { chain } from 'lodash'

import type { Option } from '@mtes-mct/monitor-ui'

export function getAmpsAsOptions(amps) {
  return chain(amps?.entities ?? amps)
    .map(l => l?.type?.trim())
    .uniq()
    .filter(l => !!l)
    .map(l => ({ label: l, value: l }))
    .sortBy('label')
    .value() as Option<string>[]
}
