import { Tag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { COLORS } from '../constants/constants'
import { MissionSourceEnum, missionSourceEnum } from '../domain/entities/missions'

import type { CSSProperties } from 'react'

export function MissionSourceTag({ source, styleProps }: { source?: MissionSourceEnum; styleProps?: CSSProperties }) {
  const text = 'Ouverte par le'
  switch (source) {
    case missionSourceEnum.MONITORENV.value:
      return (
        <SourceTag source={missionSourceEnum.MONITORENV.value} style={styleProps}>
          {text} {missionSourceEnum.MONITORENV.label}
        </SourceTag>
      )
    case missionSourceEnum.MONITORFISH.value:
      return (
        <SourceTag source={missionSourceEnum.MONITORFISH.value} style={styleProps}>
          {text} {missionSourceEnum.MONITORFISH.label}
        </SourceTag>
      )
    default:
      return null
  }
}

const SourceTag = styled(Tag)<{
  source: string
}>`
  align-self: center;
  color: ${COLORS.white};
  background-color: ${p => (p.source === missionSourceEnum.MONITORENV.value ? COLORS.mediumSeaGreen : COLORS.blueGray)};
`
