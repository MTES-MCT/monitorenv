import styled from 'styled-components'

import { RegulatoryLayerSearchResultZone, REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT } from './RegulatoryLayerSearchResultZone'

export function RegulatoryLayerSearchResultZones({ result, searchedText, zonesAreOpen }) {
  return (
    <RegulatoryZones $isOpen={zonesAreOpen} $length={result?.length}>
      {result?.map(regulatoryZone => (
        <RegulatoryLayerSearchResultZone
          key={regulatoryZone.id}
          regulatoryZone={regulatoryZone}
          searchedText={searchedText}
        />
      ))}
    </RegulatoryZones>
  )
}

const RegulatoryZones = styled.div<{ $isOpen: boolean; $length: number }>`
  height: ${props => (props.$isOpen && props.$length ? props.$length * REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT : 0)}px;
  overflow: hidden;
  transition: 0.5s all;
`
