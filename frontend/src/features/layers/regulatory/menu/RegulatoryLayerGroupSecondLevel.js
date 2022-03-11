import React, { useState } from 'react'
import styled from 'styled-components'

import RegulatoryLayerZones from './RegulatoryLayerZones'
import { COLORS } from '../../../../constants/constants'

const NumberOfZones = ({numberOfZones}) => {
  return (
    <ZonesNumber>
      {`${numberOfZones} zone${numberOfZones > 1 ? 's' : ''}`}
    </ZonesNumber>
  )
}

export const RegulatoryLayerGroupSecondLevel = ({ groupName, result }) => {

  const [zonesAreOpen, setZonesAreOpen] = useState(false)

  return (
    <>
      <LayerTopic onClick={() => setZonesAreOpen(!zonesAreOpen)} >
        <TopicName
        data-cy={'regulatory-layer-topic'}
        title={groupName}
        >
          {groupName}
        </TopicName>
        <NumberOfZones numberOfZones={result.length} />
      </LayerTopic>
      <RegulatoryLayerZones
        result={result}
        zonesAreOpen={zonesAreOpen}
      />
    </>
  )
}

const ZonesNumber = styled.span`
  font-size: 13px;
  color: ${COLORS.slateGray};
  margin-left: auto;
  line-height: 34px;
  font-weight: 400;
`

const TopicName = styled.span`
  user-select: none;
  text-overflow: ellipsis;
  overflow-x: hidden !important;
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: ${COLORS.gunMetal};
  max-width: 300px;
  line-height: 33px;
`

const LayerTopic = styled.div`
  display: flex;
  user-select: none;
  text-overflow: ellipsis;
  overflow: hidden !important;
  padding-right: 0;
  height: 35px;
  font-size: 13px;
  padding-left: 18px;
  font-weight: 700;
  color: ${COLORS.gunMetal};
  border-bottom: 1px solid ${COLORS.lightGray};
 
  :hover {
    background: ${COLORS.shadowBlueLittleOpacity};
  }
  
  .rs-checkbox-checker {
    padding-top: 24px;
  }
  
  .rs-checkbox {
    margin-left: 0;
  }
`
