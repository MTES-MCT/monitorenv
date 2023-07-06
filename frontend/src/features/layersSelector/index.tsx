import { IconButton, Accent, Size, Icon, THEME } from '@mtes-mct/monitor-ui'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { AdministrativeLayers } from './administrative'
import { AmpLayers } from './amp'
import { BaseLayerList } from './base'
import { RegulatoryLayers } from './regulatory/menu'
import { RegulatoryLayerZoneMetadata } from './regulatory/metadata'
import { LayerSearch } from './search'
import { useGetAMPsQuery } from '../../api/ampsAPI'
import { setDisplayedItems } from '../../domain/shared_slices/Global'
import { closeRegulatoryZoneMetadata } from '../../domain/use_cases/regulatory/closeRegulatoryZoneMetadata'
import { useAppSelector } from '../../hooks/useAppSelector'

export function LayersSidebar() {
  const { regulatoryMetadataLayerId, regulatoryMetadataPanelIsOpen } = useAppSelector(state => state.regulatoryMetadata)
  const { displayLayersSidebar, layersSidebarIsOpen } = useAppSelector(state => state.global)
  const { regulatoryLayers } = useAppSelector(state => state.regulatory)
  const amps = useGetAMPsQuery()

  const dispatch = useDispatch()

  const toggleLayerSidebar = () => {
    if (layersSidebarIsOpen) {
      dispatch(closeRegulatoryZoneMetadata())
    }
    dispatch(setDisplayedItems({ layersSidebarIsOpen: !layersSidebarIsOpen }))
  }

  return (
    <>
      <SidebarLayersIcon
        $isActive={layersSidebarIsOpen}
        $isVisible={displayLayersSidebar}
        accent={Accent.PRIMARY}
        data-cy="layers-sidebar"
        Icon={Icon.MapLayers}
        onClick={toggleLayerSidebar}
        size={Size.LARGE}
        title="Arbre des couches"
      />
      <Sidebar
        isVisible={displayLayersSidebar && (layersSidebarIsOpen || regulatoryMetadataPanelIsOpen)}
        layersSidebarIsOpen={layersSidebarIsOpen}
      >
        <LayerSearch isVisible={displayLayersSidebar && layersSidebarIsOpen} />
        <Layers>
          <RegulatoryLayers />
          <AmpLayers />
          <AdministrativeLayers />
          <BaseLayerList />
        </Layers>
        <RegulatoryZoneMetadataShifter
          layersSidebarIsOpen={layersSidebarIsOpen}
          regulatoryMetadataPanelIsOpen={regulatoryMetadataPanelIsOpen}
        >
          {regulatoryMetadataLayerId && <RegulatoryLayerZoneMetadata />}
        </RegulatoryZoneMetadataShifter>
      </Sidebar>
      {regulatoryLayers.length === 0 && amps.isLoading && (
        <SpinnerWrapper $layersSidebarIsOpen={layersSidebarIsOpen}>
          <FulfillingBouncingCircleSpinner color={THEME.color.gunMetal} size={30} />
          <Message>Chargement des zones cartographiques</Message>
        </SpinnerWrapper>
      )}
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
  background: ${p => p.theme.color.gainsboro};
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
  width: 352px;
  max-height: calc(100vh - 160px);
`

const SidebarLayersIcon = styled(IconButton)<{ $isActive: boolean; $isVisible: boolean }>`
  position: absolute;
  top: 10px;
  left: 12px;
  ${p => (p.$isActive ? `background: ${p.theme.color.blueGray[100]};` : '')}
  ${p => (p.$isActive ? `border-color: ${p.theme.color.blueGray[100]};` : '')}
  ${p => (p.$isVisible ? '' : 'display: none;')}
`

const SpinnerWrapper = styled.div<{ $layersSidebarIsOpen: boolean }>`
  position: absolute;
  top: 12px;
  left: ${props => (props.$layersSidebarIsOpen ? '410px' : '65px')};
  display: flex;
  padding: 4px;
`
const Message = styled.div`
  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
  padding: 4px;
`
