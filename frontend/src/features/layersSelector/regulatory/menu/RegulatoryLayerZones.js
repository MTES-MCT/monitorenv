import React from 'react'
import styled from 'styled-components'
import RegulatoryLayerZone from './RegulatoryLayerZone'

const RegulatoryLayerZones = ({result, toggleSelectRegulatoryLayer, zonesAreOpen}) => {

  return (
    <RegulatoryZones $length={result?.length} $isOpen={zonesAreOpen}>
      {
        result?.map(regulatoryZone => {
          return <RegulatoryLayerZone
            key={regulatoryZone.id}
            regulatoryZone={regulatoryZone}
            toggleSelectRegulatoryLayer={toggleSelectRegulatoryLayer}
          />
        })
      }
    </RegulatoryZones>
  )
}

const RegulatoryZones = styled.div`
  height: ${props => props.$isOpen && props.$length ? props.$length * 36 : 0}px;
  overflow: hidden;
  transition: 0.5s all;
`

export default RegulatoryLayerZones
