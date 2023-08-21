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
  const { displayLayersSidebar, isLayersSidebarVisible } = useAppSelector(state => state.global)
  const { regulatoryLayers } = useAppSelector(state => state.regulatory)
  const amps = useGetAMPsQuery()

  const dispatch = useDispatch()

  const toggleLayerSidebar = () => {
    if (isLayersSidebarVisible) {
      dispatch(closeRegulatoryZoneMetadata())
    }
    dispatch(setDisplayedItems({ isLayersSidebarVisible: !isLayersSidebarVisible }))
  }

  return (
    <>
      <SidebarLayersIcon
        $isActive={isLayersSidebarVisible}
        $isVisible={displayLayersSidebar}
        accent={Accent.PRIMARY}
        data-cy="layers-sidebar"
        Icon={Icon.MapLayers}
        onClick={toggleLayerSidebar}
        size={Size.LARGE}
        title="Arbre des couches"
      />
      <Sidebar
        isLayersSidebarVisible={isLayersSidebarVisible}
        isVisible={displayLayersSidebar && (isLayersSidebarVisible || regulatoryMetadataPanelIsOpen)}
      >
        <LayerSearch isVisible={displayLayersSidebar && isLayersSidebarVisible} />
        <Layers>
          <RegulatoryLayers />
          <AmpLayers />
          <AdministrativeLayers />
          <BaseLayerList />
        </Layers>
        <RegulatoryZoneMetadataShifter
          isLayersSidebarVisible={isLayersSidebarVisible}
          regulatoryMetadataPanelIsOpen={regulatoryMetadataPanelIsOpen}
        >
          {regulatoryMetadataLayerId && <RegulatoryLayerZoneMetadata />}
        </RegulatoryZoneMetadataShifter>
      </Sidebar>
      {(regulatoryLayers.length === 0 || amps.isLoading) && (
        <SpinnerWrapper $isLayersSidebarVisible={isLayersSidebarVisible}>
          <FulfillingBouncingCircleSpinner color={THEME.color.gunMetal} size={30} />
          <Message>
            Chargement des zones cartographiques ({regulatoryLayers.length === 0 && 'Zones réglementaires'}
            {regulatoryLayers.length === 0 && amps.isLoading ? ' et ' : ''}
            {amps.isLoading && 'Aires Marines Protégées'})
          </Message>
        </SpinnerWrapper>
      )}
    </>
  )
}

const RegulatoryZoneMetadataShifter = styled.div<{
  isLayersSidebarVisible: boolean
  regulatoryMetadataPanelIsOpen: boolean
}>`
  position: absolute;
  margin-left: ${p => {
    if (p.regulatoryMetadataPanelIsOpen) {
      if (p.isLayersSidebarVisible) {
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

const Sidebar = styled.div<{ isLayersSidebarVisible: boolean; isVisible: boolean }>`
  margin-left: ${props => (props.isLayersSidebarVisible ? 0 : '-455px')};
  opacity: ${props => (props.isVisible ? 1 : 0)};
  top: 10px;
  left: 57px;

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

const SpinnerWrapper = styled.div<{ $isLayersSidebarVisible: boolean }>`
  position: absolute;
  top: 12px;
  left: ${props => (props.$isLayersSidebarVisible ? '460px' : '65px')};
  display: flex;
  padding: 4px;
`
const Message = styled.div`
  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
  padding: 4px;
  padding-left: 8px;
`
