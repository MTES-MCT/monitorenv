import { THEME, Tag, TagBullet } from '@mtes-mct/monitor-ui'

import { ControlStatusLabels, ControlStatusEnum } from '../../../domain/entities/reporting'

export function StatusActionTag({
  controlStatus = ControlStatusEnum.CONTROL_TO_BE_DONE
}: {
  controlStatus: ControlStatusEnum
}) {
  if (controlStatus === ControlStatusEnum.CONTROL_TO_BE_DONE) {
    return (
      <Tag backgroundColor={THEME.color.gainsboro} bullet={TagBullet.DISK} bulletColor={THEME.color.goldenPoppy}>
        {ControlStatusLabels[controlStatus]}
      </Tag>
    )
  }

  return (
    <Tag backgroundColor={THEME.color.gainsboro} bullet={TagBullet.DISK} bulletColor={THEME.color.mediumSeaGreen}>
      {ControlStatusLabels[controlStatus]}
    </Tag>
  )
}
