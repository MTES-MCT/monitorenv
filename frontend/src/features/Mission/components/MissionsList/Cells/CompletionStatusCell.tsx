import { UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
import { CompletionStatusTag } from '@features/Mission/components/CompletionStatusTag'
import { getMissionCompletionStatus } from '@features/Mission/utils'
import { useMemo } from 'react'

export function CompletionStatusCell({ row }: { row?: any }) {
  const mission = row.original

  const completion = useMemo(() => getMissionCompletionStatus(mission), [mission])

  return completion ? <CompletionStatusTag completion={completion} isLight /> : UNKNOWN
}
