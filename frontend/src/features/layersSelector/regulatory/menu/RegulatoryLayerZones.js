import React from 'react'
import styled from 'styled-components'

import RegulatoryLayerZone from './RegulatoryLayerZone'

function RegulatoryLayerZones({ result, toggleSelectRegulatoryLayer, zonesAreOpen }) {
  return (
    <RegulatoryZones $isOpen={zonesAreOpen} $length={result?.length}>
      {result?.map(regulatoryZone => (
        <RegulatoryLayerZone
          key={regulatoryZone.id}
          regulatoryZone={regulatoryZone}
          toggleSelectRegulatoryLayer={toggleSelectRegulatoryLayer}
        />
      ))}
    </RegulatoryZones>
  )
}

const RegulatoryZones = styled.div`
  height: ${props => (props.$isOpen && props.$length ? props.$length * 36 : 0)}px;
  overflow: hidden;
  transition: 0.5s all;
`

export default RegulatoryLayerZones
