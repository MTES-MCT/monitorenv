import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { IconButton } from 'rsuite'

import { COLORS } from '../../constants/constants'
import { closeRegulatoryZoneMetadata } from '../../domain/use_cases/regulatory/closeRegulatoryZoneMetadata'
import { ReactComponent as LayersSVG } from '../../uiMonitor/icons/couches_carto.svg'
import { MapComponentStyle } from '../commonStyles/MapComponent.style'
import { AdministrativeLayers } from './administrative/AdministrativeLayers'
import BaseLayers from './base/BaseLayers'
import RegulatoryLayers from './regulatory/menu/RegulatoryLayers'
import RegulatoryLayerZoneMetadata from './regulatory/metadata/RegulatoryLayerZoneMetadata'
import RegulatoryLayerSearch from './regulatory/search/RegulatoryLayerSearch'

function LayersSidebar() {
  const { regulatoryMetadataPanelIsOpen } = useSelector(state => state.regulatoryMetadata)
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
        appearance="primary"
        data-cy="layers-sidebar"
        icon={<LayersSVG className="rs-icon" />}
        onClick={toggleLayerSidebar}
        title="Couches réglementaires"
        size='lg'
      />
      <Sidebar
        isVisible={layersSidebarIsOpen || regulatoryMetadataPanelIsOpen}
        layersSidebarIsOpen={layersSidebarIsOpen}
      >
        <RegulatoryLayerSearch
          layersSidebarIsOpen={layersSidebarIsOpen}
          numberOfRegulatoryLayersSaved={numberOfRegulatoryLayersSaved}
          setNumberOfRegulatoryLayersSaved={setNumberOfRegulatoryLayersSaved}
        />
        <Layers>
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
  max-height: calc(100vh - 160px);
`

const SidebarLayersIcon = styled(IconButton)`
  position: absolute;
  top: 10px;
  left: 12px;
`

export default LayersSidebar
