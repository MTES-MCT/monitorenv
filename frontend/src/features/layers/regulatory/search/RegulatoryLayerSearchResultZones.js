import React from 'react'
import styled from 'styled-components'
import RegulatoryLayerSearchResultZone from './RegulatoryLayerSearchResultZone'

const RegulatoryLayerSearchResultZones = props => {
  const {
    result,
    toggleSelectRegulatoryLayer,
    zonesAreOpen
  } = props


  return (
    <RegulatoryZones length={result?.length} isOpen={zonesAreOpen}>
      {
        result?.map(regulatoryZone => {
          return <RegulatoryLayerSearchResultZone
            key={regulatoryZone.id}
            regulatoryZone={regulatoryZone}
            toggleSelectRegulatoryLayer={toggleSelectRegulatoryLayer}
            isOpen={zonesAreOpen}
          />
        })
      }
    </RegulatoryZones>
  )
}

const RegulatoryZones = styled.div`
  height: ${props => props.isOpen && props.length ? props.length * 36 : 0}px;
  overflow: hidden;
  transition: 0.5s all;
`

export default RegulatoryLayerSearchResultZones
