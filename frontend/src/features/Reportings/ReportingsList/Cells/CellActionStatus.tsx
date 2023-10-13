import { StatusActionTag } from '../../components/StatusActionTag'

export function CellActionStatus({
  attachedEnvActionId,
  isControlRequired,
  missionId
}: {
  attachedEnvActionId: string
  isControlRequired: boolean
  missionId: string
}) {
  if (!missionId || !isControlRequired) {
    return null
  }

  return <StatusActionTag attachedEnvActionId={attachedEnvActionId} />
}
