import { chain } from 'lodash-es'

import type { Option } from '@mtes-mct/monitor-ui'
import type { EntityState } from '@reduxjs/toolkit'
import type { AMP, AMPFromAPI } from 'domain/entities/AMPs'

export function getAmpsAsOptions(amps: AMPFromAPI[] | EntityState<AMP, number>): Option<string>[] {
  if (!amps) {
    return []
  }
  const ampsToChain = 'entities' in amps ? amps.entities : amps

  return chain(ampsToChain)
    .map(l => l?.type?.trim())
    .uniq()
    .filter(l => !!l)
    .map(l => ({ label: l, value: l }))
    .sortBy('label')
    .value() as Option<string>[]
}
