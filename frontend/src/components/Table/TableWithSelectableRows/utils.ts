import { THEME } from '@mtes-mct/monitor-ui'

import type { CSSProperties } from 'styled-components'

export const createPinnedCellStyle = ({ context, index, rowLength }): CSSProperties | undefined => {
  const pinPosition = context.column.getIsPinned()
  const bordersLeft = index !== 0 ? index + 1 : 0
  const bordersRight = index === rowLength ? 0 : rowLength - (index + 1)

  switch (pinPosition) {
    case 'left': {
      return {
        borderRight: `1px solid ${THEME.color.lightGray}`,
        left: context.column.getStart('left') + bordersLeft,
        position: 'sticky'
      }
    }
    case 'right': {
      return {
        borderLeft: `1px solid ${THEME.color.lightGray}`,
        position: 'sticky',
        right: context.column.getAfter('right') + bordersRight
      }
    }
    default: {
      return undefined
    }
  }
}
