import { useMemo } from 'react'
import { CompletionStatusLabel } from 'ui/CompletionStatusLabel'

import { getMissionCompletionStatus } from '../utils'

export function CellCompletionStatus({ row }: { row?: any }) {
  const mission = row.original

  const completion = useMemo(() => getMissionCompletionStatus(mission), [mission])

  return <CompletionStatusLabel completion={completion} />
}
