import { LastPosition } from '@features/Vessel/components/VesselResume/Resume/LastPosition'
import { Vessel } from '@features/Vessel/types'
import { Icon, MapMenuDialog } from '@mtes-mct/monitor-ui'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

type PositionCard = {
  isSelected?: boolean
  onClose?: () => void
  position: Vessel.Position
  updateMargins?: (margin: number) => void
}

export function Card({ isSelected = false, onClose, position, updateMargins }: PositionCard) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (position && ref.current && updateMargins) {
      const cardHeight = ref.current.offsetHeight
      updateMargins(cardHeight === 0 ? 200 : cardHeight)
    }
  }, [position, updateMargins])

  return (
    <Container ref={ref}>
      <MapMenuDialog.Header>
        <MapMenuDialog.Title>POSITION</MapMenuDialog.Title>
        {isSelected && onClose && (
          <MapMenuDialog.CloseButton
            Icon={Icon.Close}
            onClick={() => {
              onClose()
            }}
            title="Fermer la fiche position"
          />
        )}
      </MapMenuDialog.Header>
      <Body>
        <LastPosition context={isSelected ? 'CLICKED_OVERLAY' : 'HOVERED_OVERLAY'} lastPosition={position} />
      </Body>
    </Container>
  )
}

const Container = styled(MapMenuDialog.Container)`
  margin-right: 0;
`
const Body = styled(MapMenuDialog.Body)`
  background-color: ${p => p.theme.color.gainsboro};
  padding: 5px;
`
