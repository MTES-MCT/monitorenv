import { sortBy } from 'lodash/fp'

import type { Option } from '@mtes-mct/monitor-ui'

export function getOptionsFromLabelledEnum(labelledEnum: Record<string, string>): Option[] {
  return sortBy(
    ['label'],
    Object.entries(labelledEnum).map(([value, label]) => ({
      label,
      value
    }))
  )
}
