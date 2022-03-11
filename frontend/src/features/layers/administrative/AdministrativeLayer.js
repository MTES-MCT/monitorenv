import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

import { hideAdministrativeLayer, showAdministrativeLayer } from '../../../domain/shared_slices/Administrative'

import { ShowIcon } from '../../commonStyles/icons/ShowIcon.style'
import { HideIcon } from '../../commonStyles/icons/HideIcon.style'
import { COLORS } from '../../../constants/constants'

const AdministrativeLayer = ({ layer, isGrouped, isFirst}) => {
  const dispatch = useDispatch()
  const { showedAdministrativeLayerIds } = useSelector(state=> state.administrative)

  const isLayerVisible = showedAdministrativeLayerIds.includes(layer.code)

  const toggleLayer = () => {
    if (isLayerVisible) {
      dispatch(hideAdministrativeLayer(layer.code))
    } else {
      dispatch(showAdministrativeLayer(layer.code))
    }
  }

  return <Row
      isFirst={isFirst}
      isGrouped={isGrouped}
      onClick={toggleLayer}
      data-cy={'administrative-layer-toggle'}
    >
      <LayerName title={layer.name} >
        {layer.name}
      </LayerName>
      { isLayerVisible ? <ShowIcon/> : <HideIcon/> }
    </Row>
}

const LayerName = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-top: 5px;
`

const Row = styled.span`
  margin-top: ${props => props.isFirst ? 5 : 0}px;
  padding: ${props => props.isGrouped ? '4px 0 3px 20px' : '4px 0 4px 20px'};
  padding-left: ${props => props.isGrouped ? '38px' : '20px'};
  line-height: 18px;
  display: block;
  user-select: none;
  font-size: 13px;
  font-weight: 500;
  width: 100%;
  width: -moz-available;
  width: -webkit-fill-available;
  width: stretch;
  
  :hover {
    background: ${COLORS.shadowBlueLittleOpacity};
  }
`

export default AdministrativeLayer
