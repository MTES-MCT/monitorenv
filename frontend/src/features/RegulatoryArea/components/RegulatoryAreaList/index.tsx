import { BackofficeWrapper, Title } from '@features/BackOffice/components/style'
import { BaseMap } from '@features/map/BaseMap'
import { MapAttributionsBox } from '@features/map/controls/MapAttributionsBox'
import { MapCoordinatesBox } from '@features/map/controls/MapCoordinatesBox'
import { MapLayer } from '@features/map/layers/MapLayer'
import { ZoomListener } from '@features/map/ZoomListener'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { RegulatoryAreaFilters } from './RegulatoryAreaFilters'

const childrensComponents = [
  // @ts-ignore
  <ZoomListener key="ZoomListener" />,
  <MapAttributionsBox key="MapAttributionsBox" />,
  // @ts-ignore
  <MapCoordinatesBox key="MapCoordinatesBox" />,
  <MapLayer key="MapLayer" />
]
export function RegulatoryAreaList() {
  return (
    <StyledBackofficeWrapper>
      <RegulatoryWrapper>
        <TitleContainer>
          <Title>Zones réglementaires</Title>
          <Button Icon={Icon.Plus}> Saisir une nouvelle réglementation</Button>
        </TitleContainer>
        <RegulatoryAreaFilters />
      </RegulatoryWrapper>

      <MapContainer>{childrensComponents}</MapContainer>
    </StyledBackofficeWrapper>
  )
}

const StyledBackofficeWrapper = styled(BackofficeWrapper)`
  display: flex;
  flex-direction: row;
  padding: 0px 0px 24px 24px;
`

const RegulatoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px;
  width: 50%;
`
const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${p => p.theme.color.gainsboro};

  > Button {
    align-self: start;
  }
`

const MapContainer = styled(BaseMap)`
  position: relative;
`
