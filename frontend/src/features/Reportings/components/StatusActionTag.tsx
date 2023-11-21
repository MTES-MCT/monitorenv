import { THEME, Tag } from '@mtes-mct/monitor-ui'

import { ControlStatusLabels, ControlStatusEnum } from '../../../domain/entities/reporting'

export function StatusActionTag({
  controlStatus = ControlStatusEnum.CONTROL_TO_BE_DONE
}: {
  controlStatus: ControlStatusEnum
}) {
  return (
    <Tag
      backgroundColor={THEME.color.gainsboro}
      iconColor={
        controlStatus === ControlStatusEnum.CONTROL_TO_BE_DONE ? THEME.color.goldenPoppy : THEME.color.mediumSeaGreen
      }
      withBullet
    >
      {ControlStatusLabels[controlStatus]}
    </Tag>
  )
}
