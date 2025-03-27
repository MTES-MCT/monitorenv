import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type DrawedPolygonWithCenterButtonProps = {
  className?: string
  index?: number
  onCenterOnMap: () => void
}
export function DrawedPolygonWithCenterButton({ className, index, onCenterOnMap }: DrawedPolygonWithCenterButtonProps) {
  return (
    <ZoneWrapper className={className}>
      <span>Polygone dessiné {index !== undefined ? index + 1 : ''}</span>
      <IconButton
        accent={Accent.TERTIARY}
        Icon={Icon.FocusZones}
        onClick={onCenterOnMap}
        title="Centrer sur la carte"
      />
    </ZoneWrapper>
  )
}

export const ZoneWrapper = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  justify-content: space-between;
  line-height: 1;
  padding: 5px 8px 5px;

  > button {
    padding: 0px;
  }
`
