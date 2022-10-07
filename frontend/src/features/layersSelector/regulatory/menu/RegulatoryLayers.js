import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { toggleMyRegulatoryZones } from '../../../../domain/shared_slices/LayerSidebar'
import { ReactComponent as PinSVG } from '../../../../uiMonitor/icons/Pin.svg'
import { ChevronIcon } from '../../../commonStyles/icons/ChevronIcon.style'
import RegulatoryLayerList from './RegulatoryLayerList'

function RegulatoryLayers({ regulatoryLayersAddedToMySelection }) {
  const dispatch = useDispatch()

  const { regulatoryLayers, selectedRegulatoryLayerIds } = useSelector(state => state.regulatory)
  const { myRegulatoryZonesIsOpen } = useSelector(state => state.layerSidebar)

  const selectedRegulatoryLayers = regulatoryLayers?.filter(layer => selectedRegulatoryLayerIds.includes(layer.id))

  const onTitleClicked = () => {
    dispatch(toggleMyRegulatoryZones())
  }

  return (
    <>
      <RegulatoryLayersTitle
        data-cy="regulatory-layers-my-zones"
        onClick={onTitleClicked}
        regulatoryLayersAddedToMySelection={regulatoryLayersAddedToMySelection}
        showRegulatoryLayers={myRegulatoryZonesIsOpen}
      >
        <PinSVGIcon />
        <Title>Mes zones réglementaires</Title>
        <ChevronIcon $isOpen={myRegulatoryZonesIsOpen} $right />
      </RegulatoryLayersTitle>
      {myRegulatoryZonesIsOpen && <RegulatoryLayerList results={selectedRegulatoryLayers} />}
    </>
  )
}

const PinSVGIcon = styled(PinSVG)`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  margin-right: 8px;
`
const Title = styled.span`
  font-size: 16px;
  line-height: 22px;
`

const RegulatoryLayersTitle = styled.div`
  height: 38px;
  padding-top: 8px;
  padding-left: 16px;
  color: ${COLORS.gainsboro};
  display: flex;

  cursor: pointer;
  text-align: left;
  user-select: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: ${props => (props.showRegulatoryLayers ? '0' : '2px')};
  border-bottom-right-radius: ${props => (props.showRegulatoryLayers ? '0' : '2px')};
  background: ${COLORS.charcoal};

  animation: ${props => (props.regulatoryLayersAddedToMySelection ? 'blink' : '')} 0.3s ease forwards;

  @keyframes blink {
    0% {
      background: ${COLORS.lightGray};
    }
    20% {
      background: ${COLORS.charcoal};
    }
    40% {
      background: ${COLORS.charcoal};
    }
    60% {
      background: ${COLORS.lightGray};
    }
    80% {
      background: ${COLORS.lightGray};
    }
    100% {
      background: ${COLORS.charcoal};
    }
  }
`

export default RegulatoryLayers
