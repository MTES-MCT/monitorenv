import _ from 'lodash'

import type { Option } from '@mtes-mct/monitor-ui'

export function getThemesAsListOptions(themes): Option[] {
  return _.chain(themes)
    .map(theme => theme.themeLevel1)
    .uniq()
    .sort((a, b) => a?.localeCompare(b))
    .map(t => ({ label: t, value: t }))
    .value()
}
