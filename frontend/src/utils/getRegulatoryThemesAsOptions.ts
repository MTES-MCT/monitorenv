import _ from 'lodash'

import type { Option } from '@mtes-mct/monitor-ui'

export function getRegulatoryThemesAsOptions(regulatoryThemes) {
  return _.chain(regulatoryThemes?.entities)
    .filter(l => !!l?.thematique)
    .map(l => l?.thematique.split(','))
    .flatMap(l => l)
    .filter(l => !!l)
    .map(l => l?.trim())
    .uniq()
    .map(l => ({ label: l, value: l }))
    .sortBy('label')
    .value() as Option<string>[]
}
