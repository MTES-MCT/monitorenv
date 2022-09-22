import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'
import { closeRegulatoryZoneMetadata } from '../../domain/use_cases/regulatory/closeRegulatoryZoneMetadata'
import { ReactComponent as LayersSVG } from '../../uiMonitor/icons/Couches.svg'
import { MapButtonStyle } from '../commonStyles/MapButton.style'
import { MapComponentStyle } from '../commonStyles/MapComponent.style'
import AdministrativeLayers from './administrative/AdministrativeLayers'
import BaseLayers from './base/BaseLayers'
import RegulatoryLayers from './regulatory/menu/RegulatoryLayers'
import RegulatoryLayerZoneMetadata from './regulatory/metadata/RegulatoryLayerZoneMetadata'
import RegulatoryLayerSearch from './regulatory/search/RegulatoryLayerSearch'

function LayersSidebar() {
  const { regulatoryMetadataPanelIsOpen } = useSelector(state => state.regulatoryMetadata)
  const { healthcheckTextWarning } = useSelector(state => state.global)
  const dispatch = useDispatch()

  const [layersSidebarIsOpen, setLayersSidebarIsOpen] = useState(false)
  const [numberOfRegulatoryLayersSaved, setNumberOfRegulatoryLayersSaved] = useState(0)
  const toggleLayerSidebar = () => {
    layersSidebarIsOpen && dispatch(closeRegulatoryZoneMetadata())
    setLayersSidebarIsOpen(!layersSidebarIsOpen)
  }

  return (
    <>
      <SidebarLayersIcon
        data-cy="layers-sidebar"
        healthcheckTextWarning={healthcheckTextWarning}
        isVisible={layersSidebarIsOpen || regulatoryMetadataPanelIsOpen}
        onClick={toggleLayerSidebar}
        regulatoryMetadataPanelIsOpen={regulatoryMetadataPanelIsOpen}
        title="Couches réglementaires"
      >
        <LayersIcon />
      </SidebarLayersIcon>
      <Sidebar
        healthcheckTextWarning={healthcheckTextWarning}
        isVisible={layersSidebarIsOpen || regulatoryMetadataPanelIsOpen}
        layersSidebarIsOpen={layersSidebarIsOpen}
      >
        <RegulatoryLayerSearch
          layersSidebarIsOpen={layersSidebarIsOpen}
          numberOfRegulatoryLayersSaved={numberOfRegulatoryLayersSaved}
          setNumberOfRegulatoryLayersSaved={setNumberOfRegulatoryLayersSaved}
        />
        <Layers healthcheckTextWarning={healthcheckTextWarning}>
          <RegulatoryLayers regulatoryLayersAddedToMySelection={numberOfRegulatoryLayersSaved} />
          <AdministrativeLayers />
          <BaseLayers />
        </Layers>
        <RegulatoryZoneMetadataShifter regulatoryMetadataPanelIsOpen={regulatoryMetadataPanelIsOpen}>
          <RegulatoryLayerZoneMetadata />
        </RegulatoryZoneMetadataShifter>
      </Sidebar>
    </>
  )
}

const RegulatoryZoneMetadataShifter = styled.div`
  position: absolute;
  margin-left: ${props => (props.regulatoryMetadataPanelIsOpen ? 355 : -455)}px;
  margin-top: 45px;
  top: 0px;
  opacity: ${props => (props.regulatoryMetadataPanelIsOpen ? 1 : 0)};
  background: ${COLORS.gainsboro};
  z-index: -1;
  transition: 0.5s all;
`

const Sidebar = styled(MapComponentStyle)`
  margin-left: ${props => (props.layersSidebarIsOpen ? 0 : '-458px')};
  opacity: ${props => (props.isVisible ? 1 : 0)};
  top: 10px;
  left: 57px;
  z-index: 999;
  border-radius: 2px;
  position: absolute;
  display: inline-block;
  transition: 0.5s all;
`

const Layers = styled.div`
  margin-top: 5px;
  width: 350px;
  max-height: calc(100vh - ${props => (props.healthcheckTextWarning ? '210px' : '160px')});
`

const SidebarLayersIcon = styled(MapButtonStyle)`
  position: absolute;
  display: inline-block;
  color: ${COLORS.blue};
  background: ${props => (props.isVisible ? COLORS.shadowBlue : COLORS.charcoal)};
  padding: 2px 2px 2px 2px;
  top: 10px;
  left: 12px;
  border-radius: 2px;
  height: 40px;
  width: 40px;

  :hover,
  :focus {
    background: ${props => (props.isVisible ? COLORS.shadowBlue : COLORS.charcoal)};
  }
`

const LayersIcon = styled(LayersSVG)`
  width: 35px;
  height: 35px;
`

export default LayersSidebar
