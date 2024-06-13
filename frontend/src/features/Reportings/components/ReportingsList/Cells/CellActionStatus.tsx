import { StatusActionTag } from '../../StatusActionTag'

import type { ControlStatusEnum } from 'domain/entities/reporting'

export function CellActionStatus({
  controlStatus,
  detachedFromMissionAtUtc,
  isControlRequired,
  missionId
}: {
  controlStatus: ControlStatusEnum
  detachedFromMissionAtUtc: string
  isControlRequired: boolean
  missionId: string
}) {
  if (!missionId || !isControlRequired || (missionId && detachedFromMissionAtUtc)) {
    return null
  }

  return <StatusActionTag controlStatus={controlStatus} />
}
