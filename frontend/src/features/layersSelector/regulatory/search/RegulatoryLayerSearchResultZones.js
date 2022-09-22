import React from 'react'
import styled from 'styled-components'

import RegulatoryLayerSearchResultZone from './RegulatoryLayerSearchResultZone'

function RegulatoryLayerSearchResultZones({ result, searchedText, toggleSelectRegulatoryLayer, zonesAreOpen }) {
  return (
    <RegulatoryZones $isOpen={zonesAreOpen} $length={result?.length}>
      {result?.map(regulatoryZone => (
        <RegulatoryLayerSearchResultZone
          key={regulatoryZone.id}
          regulatoryZone={regulatoryZone}
          searchedText={searchedText}
          toggleSelectRegulatoryLayer={toggleSelectRegulatoryLayer}
        />
      ))}
    </RegulatoryZones>
  )
}

const RegulatoryZones = styled.div`
  height: ${props => (props.$isOpen && props.$length ? props.$length * 32 : 0)}px;
  overflow: hidden;
  transition: 0.5s all;
`

export default RegulatoryLayerSearchResultZones
