import { CompletionStatusLabel } from '@features/Mission/components/CompletionStatusLabel'
import { getMissionCompletionStatus } from '@features/Mission/utils'
import { useMemo } from 'react'

export function CellCompletionStatus({ row }: { row?: any }) {
  const mission = row.original

  const completion = useMemo(() => getMissionCompletionStatus(mission), [mission])

  return <CompletionStatusLabel completion={completion} />
}
