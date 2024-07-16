import { VigilanceAreaForm } from '@features/VigilanceArea/components/VigilanceAreaForm'
import {
  getIsLinkingAMPToVigilanceArea,
  getIsLinkingRegulatoryToVigilanceArea,
  getIsLinkingZonesToVigilanceArea
} from '@features/VigilanceArea/slice'
import { IconButton, Accent, Size, Icon, THEME } from '@mtes-mct/monitor-ui'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import styled from 'styled-components'

import { AdministrativeLayers } from './administrative'
import { BaseLayerList } from './base'
import { AmpMetadata } from './metadataPanel/ampMetadata'
import { RegulatoryMetadata } from './metadataPanel/regulatoryMetadata'
import { closeMetadataPanel } from './metadataPanel/slice'
import { AmpLayers } from './myAmps'
import { RegulatoryLayers } from './myRegulatoryLayers'
import { MyVigilanceAreas } from './myVigilanceAreas'
import { LayerSearch } from './search'
import { useGetAMPsQuery } from '../../api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '../../api/regulatoryLayersAPI'
import { MonitorEnvLayers } from '../../domain/entities/layers/constants'
import { setDisplayedItems } from '../../domain/shared_slices/Global'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'

// TODO: Remove this when the feature flag is removed
const IS_VIGILANCE_AREA_ENABLED = import.meta.env.FRONTEND_VIGILANCE_AREA_ENABLED === 'true'

export function LayersSidebar({ isSuperUser }: { isSuperUser: boolean }) {
  const { metadataLayerId, metadataLayerType, metadataPanelIsOpen } = useAppSelector(state => state.layersMetadata)
  const isLayersSidebarVisible = useAppSelector(state => state.global.isLayersSidebarVisible)
  const displayLayersSidebar = useAppSelector(state => state.global.displayLayersSidebar)

  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)
  const secondVigilanceAreaPanelOpen = !!(
    selectedVigilanceAreaId &&
    editingVigilanceAreaId &&
    selectedVigilanceAreaId !== editingVigilanceAreaId
  )
  const mainVigilanceAreaFormOpen = !!(selectedVigilanceAreaId || (selectedVigilanceAreaId && editingVigilanceAreaId))
  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))
  const isLinkingAmpToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))

  const regulatoryAreas = useGetRegulatoryLayersQuery()
  const amps = useGetAMPsQuery()

  const dispatch = useAppDispatch()

  const toggleLayerSidebar = () => {
    if (isLayersSidebarVisible) {
      dispatch(closeMetadataPanel())
    }
    dispatch(setDisplayedItems({ isLayersSidebarVisible: !isLayersSidebarVisible }))
  }

  return (
    <>
      <SidebarLayersIcon
        $isActive={isLayersSidebarVisible}
        $isVisible={displayLayersSidebar}
        accent={Accent.PRIMARY}
        aria-label="Arbre des couches"
        data-cy="layers-sidebar"
        Icon={Icon.MapLayers}
        onClick={toggleLayerSidebar}
        size={Size.LARGE}
        title="Arbre des couches"
      />
      <Sidebar
        isLayersSidebarVisible={isLayersSidebarVisible}
        isVisible={
          (displayLayersSidebar && (isLayersSidebarVisible || metadataPanelIsOpen)) || mainVigilanceAreaFormOpen
        }
      >
        <LayerSearch />
        <Layers>
          {!isLinkingRegulatoryToVigilanceArea && <AmpLayers />}
          {!isLinkingAmpToVigilanceArea && <RegulatoryLayers />}
          {!isLinkingZonesToVigilanceArea && (
            <>
              {IS_VIGILANCE_AREA_ENABLED && isSuperUser && <MyVigilanceAreas />}
              <AdministrativeLayers />
              <BaseLayerList />
            </>
          )}
        </Layers>

        <MetadataPanelShifter
          isLayersSidebarVisible={isLayersSidebarVisible}
          isVigilanceAreaFormOpen={mainVigilanceAreaFormOpen}
          metadataPanelIsOpen={metadataPanelIsOpen || !!selectedVigilanceAreaId}
        >
          {metadataLayerType === MonitorEnvLayers.REGULATORY_ENV && metadataLayerId && <RegulatoryMetadata />}
          {metadataLayerType === MonitorEnvLayers.AMP && metadataLayerId && <AmpMetadata />}
          {IS_VIGILANCE_AREA_ENABLED && secondVigilanceAreaPanelOpen && (
            <VigilanceAreaForm
              key={selectedVigilanceAreaId}
              isOpen={secondVigilanceAreaPanelOpen}
              isReadOnly
              vigilanceAreaId={selectedVigilanceAreaId}
            />
          )}
        </MetadataPanelShifter>

        {IS_VIGILANCE_AREA_ENABLED && isSuperUser && (
          <VigilanceAreaPanelShifter
            isLayersSidebarVisible={isLayersSidebarVisible}
            isVigilanceAreaFormOpen={mainVigilanceAreaFormOpen}
          >
            {mainVigilanceAreaFormOpen && (
              <VigilanceAreaForm
                key={editingVigilanceAreaId}
                isOpen={mainVigilanceAreaFormOpen}
                vigilanceAreaId={editingVigilanceAreaId ?? selectedVigilanceAreaId}
              />
            )}
          </VigilanceAreaPanelShifter>
        )}
      </Sidebar>
      {(regulatoryAreas.isLoading || amps.isLoading) && (
        <SpinnerWrapper $isLayersSidebarVisible={isLayersSidebarVisible}>
          <FulfillingBouncingCircleSpinner color={THEME.color.gunMetal} size={30} />
          <Message>
            Chargement des zones cartographiques ({regulatoryAreas.isLoading && 'Zones réglementaires'}
            {regulatoryAreas.isLoading && amps.isLoading ? ' et ' : ''}
            {amps.isLoading && 'Aires Marines Protégées'})
          </Message>
        </SpinnerWrapper>
      )}
    </>
  )
}

const MetadataPanelShifter = styled.div<{
  isLayersSidebarVisible: boolean
  isVigilanceAreaFormOpen: boolean
  metadataPanelIsOpen: boolean
}>`
  position: absolute;
  left: ${p => {
    if (p.metadataPanelIsOpen) {
      if (p.isLayersSidebarVisible) {
        if (p.isVigilanceAreaFormOpen) {
          return '773'
        }

        return '355'
      }

      if (p.isVigilanceAreaFormOpen) {
        return '828'
      }

      return '410'
    }

    return '-455'
  }}px;
  top: 45px;
  opacity: ${props => (props.metadataPanelIsOpen ? 1 : 0)};
  background: ${p => p.theme.color.gainsboro};
  z-index: -1;
  transition: 0.5s all;
`

const VigilanceAreaPanelShifter = styled.div<{
  isLayersSidebarVisible: boolean
  isVigilanceAreaFormOpen: boolean
}>`
  position: absolute;
  left: ${p => {
    if (p.isVigilanceAreaFormOpen) {
      if (p.isLayersSidebarVisible) {
        return '355'
      }

      return '410'
    }

    return '-455'
  }}px;
  top: 45px;
  opacity: ${props => (props.isVigilanceAreaFormOpen ? 1 : 0)};
  background: ${p => p.theme.color.gainsboro};
  z-index: -1;
  transition: 0.5s all;
`

const Sidebar = styled.div<{ isLayersSidebarVisible: boolean; isVisible: boolean }>`
  margin-left: ${props => (props.isLayersSidebarVisible ? 0 : '-455px')};
  opacity: ${props => (props.isVisible ? 1 : 0)};
  top: 10px;
  left: 57px;
  z-index: 1;
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
  ${p => (p.$isActive ? `background: ${p.theme.color.blueGray};` : '')}
  ${p => (p.$isActive ? `border-color: ${p.theme.color.blueGray};` : '')}
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
