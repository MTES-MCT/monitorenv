import { THEME, Tag, TagBullet } from '@mtes-mct/monitor-ui'

export function CellActionStatus({
  attachedEnvActionId,
  attachedMissionId,
  isControlRequired
}: {
  attachedEnvActionId: number
  attachedMissionId: string
  isControlRequired: boolean
}) {
  if (!attachedMissionId || !isControlRequired) {
    return null
  }

  if (attachedMissionId && isControlRequired && !attachedEnvActionId) {
    return (
      <Tag backgroundColor={THEME.color.gainsboro} bullet={TagBullet.DISK} bulletColor={THEME.color.goldenPoppy}>
        Contrôle à faire
      </Tag>
    )
  }

  return (
    <Tag backgroundColor={THEME.color.gainsboro} bullet={TagBullet.DISK} bulletColor={THEME.color.mediumSeaGreen}>
      Contrôle fait
    </Tag>
  )
}
