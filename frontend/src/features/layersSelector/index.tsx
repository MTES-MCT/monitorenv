import { dashboardActions } from '@features/Dashboard/slice'
import { LocalizedAreas } from '@features/LocalizedArea'
import { NumberOfFilters } from '@features/map/shared/style'
import { VigilanceAreaForm } from '@features/VigilanceArea/components/VigilanceAreaForm'
import {
  getIsLinkingAMPToVigilanceArea,
  getIsLinkingRegulatoryToVigilanceArea,
  getIsLinkingZonesToVigilanceArea
} from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMountTransition } from '@hooks/useMountTransition'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
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
import { MonitorEnvLayers } from '../../domain/entities/layers/constants'
import { restorePreviousDisplayedItems, setDisplayedItems } from '../../domain/shared_slices/Global'

export function LayersSidebar() {
  const dashboardMapFocus = useAppSelector(state => state.dashboard.mapFocus)

  const { metadataLayerId, metadataLayerType, metadataPanelIsOpen } = useAppSelector(state => state.layersMetadata)
  const isLayersSidebarVisible = useAppSelector(state => state.global.visibility.isLayersSidebarVisible)
  const displayLayersSidebar = useAppSelector(state => state.global.menus.displayLayersSidebar)

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
  const nbOfFiltersSetted = useAppSelector(state => state.vigilanceAreaFilters.nbOfFiltersSetted)

  // const regulatoryAreas = useGetRegulatoryLayersQuery()
  // const amps = useGetAMPsQuery()

  const dispatch = useAppDispatch()

  const toggleLayerSidebar = () => {
    if (isLayersSidebarVisible) {
      dispatch(closeMetadataPanel())
    }

    dispatch(layerSidebarActions.toggleRegFilters(true))
    if (dashboardMapFocus) {
      dispatch(dashboardActions.setMapFocus(false))
      dispatch(restorePreviousDisplayedItems())
    }
    dispatch(setDisplayedItems({ visibility: { isLayersSidebarVisible: !isLayersSidebarVisible } }))
  }

  const {
    controlPlan,
    filteredAmpTypes,
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    globalSearchText,
    searchExtent
  } = useAppSelector(state => state.layerSearch)

  const numberOfMapFilters =
    (filteredRegulatoryTags.length > 0 ? 1 : 0) +
    (filteredRegulatoryThemes.length > 0 ? 1 : 0) +
    (filteredAmpTypes?.length > 0 ? 1 : 0) +
    (globalSearchText ? 1 : 0) +
    (controlPlan ? 1 : 0) +
    (searchExtent ? 1 : 0)

  const numberOfFilters = nbOfFiltersSetted + numberOfMapFilters

  const isSideBarVisible =
    (displayLayersSidebar && (isLayersSidebarVisible || metadataPanelIsOpen)) || mainVigilanceAreaFormOpen

  const hasTransition = useMountTransition(isSideBarVisible, 500)

  return (
    <Container>
      {!isLayersSidebarVisible && numberOfFilters > 0 && <NumberOfFilters>{numberOfFilters}</NumberOfFilters>}
      <SidebarLayersIcon
        $isVisible={displayLayersSidebar}
        accent={Accent.PRIMARY}
        className={isLayersSidebarVisible ? '_active' : ''}
        data-cy="layers-sidebar"
        Icon={Icon.MapLayers}
        onClick={toggleLayerSidebar}
        size={Size.LARGE}
        title="Arbre des couches"
      />
      {(hasTransition || isSideBarVisible) && (
        <Sidebar
          $isLayersSidebarVisible={hasTransition && isLayersSidebarVisible}
          $isVisible={hasTransition && isSideBarVisible}
        >
          <LayerSearch numberOfFilters={numberOfFilters} />
          <Layers>
            {!isLinkingRegulatoryToVigilanceArea && <AmpLayers />}
            {!isLinkingAmpToVigilanceArea && <RegulatoryLayers />}
            {!isLinkingZonesToVigilanceArea && (
              <>
                <MyVigilanceAreas />
                <AdministrativeLayers />
                <LocalizedAreas />
                <BaseLayerList />
              </>
            )}
          </Layers>

          <MetadataPanelShifter
            $isLayersSidebarVisible={isLayersSidebarVisible}
            $isVigilanceAreaFormOpen={mainVigilanceAreaFormOpen}
            $metadataPanelIsOpen={metadataPanelIsOpen || !!selectedVigilanceAreaId}
          >
            {metadataLayerType === MonitorEnvLayers.REGULATORY_ENV && metadataLayerId && <RegulatoryMetadata />}
            {metadataLayerType === MonitorEnvLayers.AMP && metadataLayerId && <AmpMetadata />}
            {secondVigilanceAreaPanelOpen && (
              <VigilanceAreaForm
                key={selectedVigilanceAreaId}
                isOpen={secondVigilanceAreaPanelOpen}
                isReadOnly
                vigilanceAreaId={selectedVigilanceAreaId}
              />
            )}
          </MetadataPanelShifter>

        <VigilanceAreaPanelShifter
          $isLayersSidebarVisible={isLayersSidebarVisible}
          $isVigilanceAreaFormOpen={mainVigilanceAreaFormOpen}
        >
          {mainVigilanceAreaFormOpen && (
            <VigilanceAreaForm
              key={editingVigilanceAreaId}
              isOpen={mainVigilanceAreaFormOpen}
              vigilanceAreaId={editingVigilanceAreaId ?? selectedVigilanceAreaId}
            />
          )}
        </VigilanceAreaPanelShifter>
      </Sidebar>
      )}
      {/* {(regulatoryAreas.isLoading || amps.isLoading) && ( */}
      {/*   <SpinnerWrapper $isLayersSidebarVisible={isLayersSidebarVisible}> */}
      {/*     <FulfillingBouncingCircleLoader color={THEME.color.gunMetal} size={30} /> */}
      {/*     <Message> */}
      {/*       Chargement des zones cartographiques ({regulatoryAreas.isLoading && 'Zones réglementaires'} */}
      {/*       {regulatoryAreas.isLoading && amps.isLoading ? ' et ' : ''} */}
      {/*       {amps.isLoading && 'Aires Marines Protégées'}) */}
      {/*     </Message> */}
      {/*   </SpinnerWrapper> */}
      {/* )} */}
    </Container>
  )
}

const Container = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
`

const MetadataPanelShifter = styled.div<{
  $isLayersSidebarVisible: boolean
  $isVigilanceAreaFormOpen: boolean
  $metadataPanelIsOpen: boolean
}>`
  position: absolute;
  left: ${p => {
    if (p.$metadataPanelIsOpen) {
      if (p.$isLayersSidebarVisible) {
        if (p.$isVigilanceAreaFormOpen) {
          return '773'
        }

        return '355'
      }

      if (p.$isVigilanceAreaFormOpen) {
        return '828'
      }

      return '410'
    }

    return '-455'
  }}px;
  top: 45px;
  opacity: ${props => (props.$metadataPanelIsOpen ? 1 : 0)};
  background: ${p => p.theme.color.gainsboro};
  transition: 0.5s all;
  height: 0;
  z-index: 1;
`

const VigilanceAreaPanelShifter = styled.div<{
  $isLayersSidebarVisible: boolean
  $isVigilanceAreaFormOpen: boolean
}>`
  position: absolute;
  left: ${p => {
    if (p.$isVigilanceAreaFormOpen) {
      if (p.$isLayersSidebarVisible) {
        return '355'
      }

      return '410'
    }

    return '-455'
  }}px;
  top: 45px;
  opacity: ${p => (p.$isVigilanceAreaFormOpen ? 1 : 0)};
  transition: 0.5s all;
  z-index: -1;
`

const Sidebar = styled.div<{ $isLayersSidebarVisible: boolean; $isVisible: boolean }>`
  transform: ${p => (p.$isLayersSidebarVisible ? 'translateX(0);' : `translateX(-100%) translateX(-104px);`)};
  opacity: ${p => (p.$isVisible ? 1 : 0)};
  top: 0;
  left: 46px;
  z-index: 1;
  border-radius: 2px;
  position: absolute;
  transition: 0.5s all;
`

const Layers = styled.div`
  width: 352px;
  max-height: calc(100vh - 160px);
`

const SidebarLayersIcon = styled(IconButton)<{ $isVisible: boolean }>`
  ${p => (p.$isVisible ? '' : 'display: none;')}
`

const SpinnerWrapper = styled.div<{ $isLayersSidebarVisible: boolean }>`
  position: absolute;
  top: 0;
  left: ${props => (props.$isLayersSidebarVisible ? '460px' : '56px')};
  display: flex;
  padding: 4px;
`
const Message = styled.div`
  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
  padding: 4px 4px 4px 8px;
`
