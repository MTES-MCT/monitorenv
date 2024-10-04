import { chain } from 'lodash'

import type { Option } from '@mtes-mct/monitor-ui'
import type { EntityState } from '@reduxjs/toolkit'
import type { RegulatoryLayerCompactFromAPI } from 'domain/entities/regulatory'

export function getRegulatoryThemesAsOptions(
  regulatoryThemes: RegulatoryLayerCompactFromAPI[] | EntityState<RegulatoryLayerCompactFromAPI, number>
): Option<string>[] {
  if (!regulatoryThemes) {
    return []
  }
  const ampsToChain = 'entities' in regulatoryThemes ? regulatoryThemes.entities : regulatoryThemes

  return chain(ampsToChain)
    .filter(l => !!l?.thematique)
    .map(l => l?.thematique.split(','))
    .flatMap(l => l)
    .filter(l => !!l && l.trim().length > 0)
    .map(l => l?.trim())
    .uniq()
    .map(l => ({ label: l, value: l }))
    .sortBy('label')
    .value() as Option<string>[]
}
