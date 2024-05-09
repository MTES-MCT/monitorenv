import { getMissionCompletionStatus } from '@features/Mission/utils'
import { useMemo } from 'react'

import { CompletionStatusLabel } from '../Shared/CompletionStatusLabel'

export function CellCompletionStatus({ row }: { row?: any }) {
  const mission = row.original

  const completion = useMemo(() => getMissionCompletionStatus(mission), [mission])

  return <CompletionStatusLabel completion={completion} />
}
