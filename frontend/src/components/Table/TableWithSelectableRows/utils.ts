import { THEME } from '@mtes-mct/monitor-ui'

import type { CSSProperties } from 'react'

export const UNKNOWN = '-'

export const createPinnedCellStyle = ({ context, index, stickyLeftBorderIndex }): CSSProperties | undefined => {
  const pinPosition = context.column.getIsPinned()

  switch (pinPosition) {
    case 'left': {
      return {
        borderRight: stickyLeftBorderIndex === index ? `1px solid ${THEME.color.lightGray}` : `none`,
        left: context.column.getStart('left'),
        position: 'sticky'
      }
    }
    case 'right': {
      return {
        borderLeft: `1px solid ${THEME.color.lightGray}`,
        position: 'sticky',
        right: context.column.getAfter('right')
      }
    }
    default: {
      return undefined
    }
  }
}
