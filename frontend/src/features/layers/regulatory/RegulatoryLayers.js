import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../../../constants/constants'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import RegulatoryLayerList from "./menu/RegulatoryLayerList";
import { toggleMyRegulatoryZones } from '../../../domain/shared_slices/LayerSidebar'

const RegulatoryLayers = ({regulatoryLayersAddedToMySelection}) => {
  const dispatch = useDispatch()

  const {
    selectedRegulatoryLayerIds,
    regulatoryLayers
  } = useSelector(state => state.regulatory)
  const { myRegulatoryZonesIsOpen } = useSelector(state => state.layerSidebar)

  const selectedRegulatoryLayers = regulatoryLayers.filter(layer => selectedRegulatoryLayerIds.includes(layer.id))


  const onTitleClicked = () => {
    dispatch(toggleMyRegulatoryZones())
  }

  return (
    <>
      <RegulatoryLayersTitle
        data-cy={'regulatory-layers-my-zones'}
        onClick={onTitleClicked}
        regulatoryLayersAddedToMySelection={regulatoryLayersAddedToMySelection}
        showRegulatoryLayers={myRegulatoryZonesIsOpen}
      >
        Mes zones réglementaires <ChevronIcon $isOpen={myRegulatoryZonesIsOpen}/>
      </RegulatoryLayersTitle>
      { myRegulatoryZonesIsOpen && <RegulatoryLayerList results={selectedRegulatoryLayers}></RegulatoryLayerList> }
    </>
  )
}

const RegulatoryLayersTitle = styled.div`
  height: 30px;
  padding-top: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: ${props => props.showRegulatoryLayers ? '0' : '2px'};
  border-bottom-right-radius: ${props => props.showRegulatoryLayers ? '0' : '2px'};
  background: ${COLORS.charcoal};
  
  animation: ${props => props.regulatoryLayersAddedToMySelection ? 'blink' : ''} 0.3s ease forwards;

  @keyframes blink {
    0%   {
        background: ${COLORS.lightGray};
    }
    20%   {
        background: ${COLORS.charcoal};
    }
    40% {
        background: ${COLORS.charcoal};
    }
    60%   {
        background: ${COLORS.lightGray};
    }
    80%   {
        background: ${COLORS.lightGray};
    }
    100% {
        background: ${COLORS.charcoal};
    }
  }
  
  color: ${COLORS.gainsboro};
  font-size: 16px;
  cursor: pointer;
  text-align: left;
  padding-left: 20px;
  user-select: none;
`

export default RegulatoryLayers
