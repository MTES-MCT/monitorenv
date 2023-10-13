import { StatusActionTag } from '../../components/StatusActionTag'

import type { ControlStatusEnum } from '../../../../domain/entities/reporting'

export function CellActionStatus({
  controlStatus,
  isControlRequired,
  missionId
}: {
  controlStatus: ControlStatusEnum
  isControlRequired: boolean
  missionId: string
}) {
  if (!missionId || !isControlRequired) {
    return null
  }

  return <StatusActionTag controlStatus={controlStatus} />
}
