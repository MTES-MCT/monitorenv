import { getMissionCompletionStatus } from '@features/Mission/utils'

import { FrontCompletionStatus, type Mission } from '../../../../domain/entities/missions'

export function isMissionPartOfSelectedCompletionStatus(
  mission: Mission,
  selectedCompletionStatus: string[] | undefined
): boolean {
  if (!selectedCompletionStatus || selectedCompletionStatus.length === 0) {
    return true
  }

  const completion = getMissionCompletionStatus(mission)

  if (!completion) {
    return false
  }
  // we don't make differnece between TO_COMPLETE and TO_COMPLETE_MISSION_ENDED in filters
  if (completion === FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED) {
    return selectedCompletionStatus.includes(FrontCompletionStatus.TO_COMPLETE)
  }

  return selectedCompletionStatus.includes(completion)
}
