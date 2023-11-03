import { StatusActionTag } from '../../components/StatusActionTag'

export function CellActionStatus({
  attachedEnvActionId,
  attachedMissionId,
  isControlRequired
}: {
  attachedEnvActionId: string
  attachedMissionId: string
  isControlRequired: boolean
}) {
  if (!attachedMissionId || !isControlRequired) {
    return null
  }

  return <StatusActionTag attachedEnvActionId={attachedEnvActionId} />
}
