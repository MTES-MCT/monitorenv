import type { Option } from '@mtes-mct/monitor-ui'

export const sortControlPlans = (a: Option<number>, b: Option<number>) => {
  if (a.label.startsWith('Autre')) {
    return 1
  }
  if (b.label.startsWith('Autre')) {
    return -1
  }

  return a?.label.localeCompare(b?.label)
}
