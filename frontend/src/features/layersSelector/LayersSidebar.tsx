import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'
import { closeRegulatoryZoneMetadata } from '../../domain/use_cases/regulatory/closeRegulatoryZoneMetadata'
import { useAppSelector } from '../../hooks/useAppSelector'
import { ReactComponent as LayersSVG } from '../../uiMonitor/icons/Couches_carto.svg'
import { AdministrativeLayers } from './administrative/AdministrativeLayers'
import BaseLayers from './base/BaseLayers'
import { RegulatoryLayers } from './regulatory/menu/RegulatoryLayers'
import { RegulatoryLayerZoneMetadata } from './regulatory/metadata/RegulatoryLayerZoneMetadata'
import { RegulatoryLayerSearch } from './regulatory/search/RegulatoryLayerSearch'

export function LayersSidebar() {
  const { regulatoryMetadataLayerId, regulatoryMetadataPanelIsOpen } = useAppSelector(state => state.regulatoryMetadata)
  const dispatch = useDispatch()

  const [layersSidebarIsOpen, setLayersSidebarIsOpen] = useState(false)
  const toggleLayerSidebar = () => {
    if (layersSidebarIsOpen) {
      dispatch(closeRegulatoryZoneMetadata())
    }
    setLayersSidebarIsOpen(!layersSidebarIsOpen)
  }

  return (
    <>
      <SidebarLayersIcon
        appearance="primary"
        data-cy="layers-sidebar"
        icon={<LayersSVG className="rs-icon" />}
        onClick={toggleLayerSidebar}
        size="lg"
        title="Couches réglementaires"
      />
      <Sidebar
        isVisible={layersSidebarIsOpen || regulatoryMetadataPanelIsOpen}
        layersSidebarIsOpen={layersSidebarIsOpen}
      >
        <RegulatoryLayerSearch isVisible={layersSidebarIsOpen} />
        <Layers>
          <RegulatoryLayers />
          <AdministrativeLayers />
          <BaseLayers />
        </Layers>
        <RegulatoryZoneMetadataShifter
          layersSidebarIsOpen={layersSidebarIsOpen}
          regulatoryMetadataPanelIsOpen={regulatoryMetadataPanelIsOpen}
        >
          {regulatoryMetadataLayerId && <RegulatoryLayerZoneMetadata />}
        </RegulatoryZoneMetadataShifter>
      </Sidebar>
    </>
  )
}

const RegulatoryZoneMetadataShifter = styled.div<{
  layersSidebarIsOpen: boolean
  regulatoryMetadataPanelIsOpen: boolean
}>`
  position: absolute;
  margin-left: ${p => {
    if (p.regulatoryMetadataPanelIsOpen) {
      if (p.layersSidebarIsOpen) {
        return '355'
      }

      return '410'
    }

    return '-455'
  }}px;
  margin-top: 45px;
  top: 0px;
  opacity: ${props => (props.regulatoryMetadataPanelIsOpen ? 1 : 0)};
  background: ${COLORS.gainsboro};
  z-index: -1;
  transition: 0.5s all;
`

const Sidebar = styled.div<{ isVisible: boolean; layersSidebarIsOpen: boolean }>`
  margin-left: ${props => (props.layersSidebarIsOpen ? 0 : '-455px')};
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
