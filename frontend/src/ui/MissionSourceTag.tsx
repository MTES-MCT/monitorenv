import styled from 'styled-components'

import { COLORS } from '../constants/constants'
import { MissionSourceEnum, missionSourceEnum } from '../domain/entities/missions'

export function MissionSourceTag({ source }: { source?: MissionSourceEnum }) {
  const text = 'Ouverte par le'
  switch (source) {
    case missionSourceEnum.MONITORENV.value:
      return (
        <SourceTag source={missionSourceEnum.MONITORENV.value}>
          <p>
            {text} {missionSourceEnum.MONITORENV.label}
          </p>
        </SourceTag>
      )
    case missionSourceEnum.MONITORFISH.value:
      return (
        <SourceTag source={missionSourceEnum.MONITORFISH.value}>
          <p>
            {text} {missionSourceEnum.MONITORFISH.label}
          </p>
        </SourceTag>
      )
    default:
      return null
  }
}

const SourceTag = styled.div<{
  source: string
}>`
  border-radius: 11px;
  padding-left: 8px;
  padding-right: 8px;
  display: inline-block;
  color: ${COLORS.white};
  background-color: ${p => (p.source === missionSourceEnum.MONITORENV.value ? COLORS.mediumSeaGreen : COLORS.blueGray)};
  p {
    margin: auto;
    font-size: 13px;
  }
`
