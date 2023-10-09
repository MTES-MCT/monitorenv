import { THEME, Tag, TagBullet } from '@mtes-mct/monitor-ui'

export function StatusActionTag({ attachedEnvActionId }: { attachedEnvActionId: string | undefined }) {
  if (!attachedEnvActionId) {
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
