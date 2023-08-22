import _ from 'lodash'

import type { Option } from '@mtes-mct/monitor-ui'

export function getSubThemesAsListOptions(themes): Option[] {
  return _.chain(themes)
    .map(theme => theme.themeLevel2 || '')
    .sort((a, b) => a?.localeCompare(b))
    .uniq()
    .map(t => ({ label: t, value: t }))
    .value()
}
