import React from 'react'
import styled from 'styled-components'
import RegulatoryLayerSearchResultZone from './RegulatoryLayerSearchResultZone'

const RegulatoryLayerSearchResultZones = ({result, toggleSelectRegulatoryLayer, zonesAreOpen, searchedText}) => {

  return (
    <RegulatoryZones $length={result?.length} $isOpen={zonesAreOpen}>
      {
        result?.map(regulatoryZone => {
          return <RegulatoryLayerSearchResultZone
            key={regulatoryZone.id}
            regulatoryZone={regulatoryZone}
            toggleSelectRegulatoryLayer={toggleSelectRegulatoryLayer}
            searchedText={searchedText}
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

export default RegulatoryLayerSearchResultZones
