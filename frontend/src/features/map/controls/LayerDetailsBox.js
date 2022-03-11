/* eslint-disable camelcase */
import React from 'react'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'

const LayerDetailsBox = () => {


const regulatoryFeatureToShowOnCard = false
const vectorLayerStyle = false


  return (regulatoryFeatureToShowOnCard && <Details>
        <Rectangle vectorLayerStyle={vectorLayerStyle}/>
        <Text>
          {regulatoryFeatureToShowOnCard.getProperties().layer_name.replace(/[_]/g, ' ')}
          {
            regulatoryFeatureToShowOnCard.getProperties().zones
              ? <ZoneName>{regulatoryFeatureToShowOnCard.getProperties().zones.replace(/[_]/g, ' ')}</ZoneName>
              : null
          }
        </Text>
  </Details>)
}

const Rectangle = styled.div`
  width: 14px;
  height: 14px;
  background: ${props => props.vectorLayerStyle?.getFill() ? props.vectorLayerStyle.getFill().getColor() : COLORS.gray};
  border: 1px solid ${props => props.vectorLayerStyle?.getStroke() ? props.vectorLayerStyle.getStroke().getColor() : COLORS.grayDarkerTwo};
  margin-right: 7px;
  margin-top: 5px;
`

const Text = styled.span`
  vertical-align: text-bottom;
  margin-top: 3px;
`

const Details = styled.span`
  position: absolute;
  bottom: 10px;
  left: 420px;
  display: flex;
  margin: 1px;
  padding: 0 10px 4px 10px;
  text-decoration: none;
  text-align: center;
  height: 21px;
  border: none;
  border-radius: 2px;
  background: ${COLORS.gainsboro};
  font-size: 13px;
  font-weight: 500;
  color: ${COLORS.charcoal}
`

const ZoneName = styled.span`
  font-weight: 400;
  color: ${COLORS.grayDarkerTwo}
  font-size: 13px;
  margin-left: 10px;
`

export default LayerDetailsBox
