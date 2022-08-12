import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { RadioGroup } from 'rsuite'

import BaseLayerItem from './BaseLayerItem'
import { COLORS } from '../../../constants/constants'
import { baseLayers } from '../../../domain/entities/layers'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { toggleBaseLayer } from '../../../domain/shared_slices/LayerSidebar'
import { selectBaseLayer } from '../../../domain/shared_slices/Map'

const baseLayersKeys = Object.keys(baseLayers).filter(key => key !== baseLayers.DARK.code)

const BaseLayers = () => {
  const dispatch = useDispatch()
  const { baselayerIsOpen } = useSelector(state => state.layerSidebar)
  const {selectedBaseLayer} = useSelector(state => state.map)
  const onSectionTitleClicked = () => {
    dispatch(toggleBaseLayer())
  }
  const handleSelectBaseLayer = (layercode) => {
    dispatch(selectBaseLayer(layercode))
  }

  return (
    <>
      <SectionTitle onClick={onSectionTitleClicked} $showBaseLayers={baselayerIsOpen}>
        Fonds de carte <ChevronIcon $right $isOpen={baselayerIsOpen}/>
      </SectionTitle>
      <RadioGroup onChange={handleSelectBaseLayer} value={selectedBaseLayer}>
        <BaseLayersList $showBaseLayers={baselayerIsOpen} $baseLayersLength={baseLayersKeys.length}>
          {
            baseLayersKeys.map(layer => {
              return (
              <ListItem key={layer}>
                <BaseLayerItem layer={layer} />
              </ListItem>)
            })
          }
        </BaseLayersList>
      </RadioGroup>
    </>
  )
}

const SectionTitle = styled.div`
  height: 38px;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  background: ${COLORS.charcoal};
  color: ${COLORS.gainsboro};
  font-size: 16px;
  padding-top: 5px;
  cursor: pointer;
  text-align: left;
  padding-left: 20px;
  user-select: none;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: ${props => props.$showBaseLayers ? '0' : '2px'};
  border-bottom-right-radius: ${props => props.$showBaseLayers ? '0' : '2px'};
`

const BaseLayersList = styled.ul`
  margin: 0;
  border-radius: 0;
  padding: 0;
  height: 0;
  overflow-y: hidden;
  overflow-x: hidden;
  background: ${COLORS.background};
  
  animation: ${props => props.$showBaseLayers ? 'zones-opening' : 'zones-closing'} 0.5s ease forwards;

  @keyframes zones-opening {
    0%   { height: 0;   }
    100% { height: ${props => props.$baseLayersLength ? `${34 * props.$baseLayersLength}px` : '175px'}; }
  }

  @keyframes zones-closing {
    0%   { height: ${props => props.$baseLayersLength ? `${34 * props.$baseLayersLength}px` : '175px'}; }
    100% { height: 0;   }
  }
  
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
`

const ListItem = styled.li`
  padding: 6px 5px 5px 0px;
  margin: 0;
  text-align: left;
  list-style-type: none;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden !important;
  cursor: pointer;
  background: ${COLORS.background};
  color: ${COLORS.gunMetal};
  border-bottom: 1px solid ${COLORS.lightGray};
  line-height: 1.9em;
  
  :hover {
    background: ${COLORS.shadowBlueLittleOpacity};
  }
`

export default BaseLayers
