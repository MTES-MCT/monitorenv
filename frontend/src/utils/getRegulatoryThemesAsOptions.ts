import { chain } from 'lodash'

import type { Option } from '@mtes-mct/monitor-ui'

export function getRegulatoryThemesAsOptions(regulatoryThemes) {
  return chain(regulatoryThemes?.entities ?? regulatoryThemes)
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
