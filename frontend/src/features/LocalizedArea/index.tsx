import { useGetLocalizedAreasQuery } from '@api/localizedAreasAPI'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import { useMemo } from 'react'
import styled from 'styled-components'

import { LocalizedAreaPanel } from './components/LocalizedAreaPanel'
import { LocalizedAreasItem } from './components/LocalizedAreasItem'
import { ChevronIcon } from '../commonStyles/icons/ChevronIcon.style'
import { LayerSelector } from '../layersSelector/utils/LayerSelector.style'

import type { LocalizedArea } from './types'

export function LocalizedAreas() {
  const { data: localizedAreas } = useGetLocalizedAreasQuery()
  const dispatch = useAppDispatch()
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)
  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)
  const mainVigilanceAreaFormOpen = !!(selectedVigilanceAreaId || (selectedVigilanceAreaId && editingVigilanceAreaId))

  const { metadataLayerId, metadataLayerType, metadataPanelIsOpen } = useAppSelector(state => state.layersMetadata)
  const isLayersSidebarVisible = useAppSelector(state => state.global.visibility.isLayersSidebarVisible)
  const localizedAreasIsOpen = useAppSelector(state => state.layerSidebar.localizedAreasIsOpen)

  const onSectionTitleClicked = () => {
    dispatch(layerSidebarActions.toggleLocalizedAreas())
  }

  const groupedLocalizedAreas = useMemo(
    () =>
      localizedAreas?.entities
        ? Object.values(localizedAreas.entities).reduce(
            (acc: Record<string, LocalizedArea.LocalizedAreaWithBbox[]>, localizedArea) => {
              const { groupName } = localizedArea
              acc[groupName] ??= []
              acc[groupName].push(localizedArea)

              return acc
            },
            {} as Record<string, LocalizedArea.LocalizedAreaWithBbox[]>
          )
        : undefined,
    [localizedAreas]
  )

  const selectedLocalizedArea = useMemo(
    () =>
      localizedAreas?.entities
        ? Object.values(localizedAreas.entities)?.find(localizedArea => localizedArea.groupName === metadataLayerId)
        : undefined,
    [localizedAreas, metadataLayerId]
  )

  const totalLocalizedAreas = Object.keys(groupedLocalizedAreas || {}).length

  return (
    <>
      <LayerSelector.Wrapper
        $isExpanded={localizedAreasIsOpen}
        data-cy="loacalizes-areas-open"
        onClick={onSectionTitleClicked}
      >
        <LayerSelector.Title>Zones secteurs locaux</LayerSelector.Title>
        <ChevronIcon $isOpen={localizedAreasIsOpen} $right />
      </LayerSelector.Wrapper>
      {groupedLocalizedAreas && totalLocalizedAreas > 0 ? (
        <ZonesList $showZones={localizedAreasIsOpen} $zonesLength={totalLocalizedAreas}>
          {Object.entries(groupedLocalizedAreas).map(([groupName, localizedAreasByGroup]) => (
            <ListItem key={groupName}>
              <LocalizedAreasItem groupName={groupName} localizedAreas={localizedAreasByGroup} />
            </ListItem>
          ))}
        </ZonesList>
      ) : null}
      <LocalizedAreaPanelWrapper
        $isLayersSidebarVisible={isLayersSidebarVisible}
        $isVigilanceAreaFormOpen={mainVigilanceAreaFormOpen}
        $metadataPanelIsOpen={metadataPanelIsOpen}
      >
        {metadataLayerType === MonitorEnvLayers.LOCALIZED_AREAS && metadataLayerId && (
          <LocalizedAreaPanel localizedArea={selectedLocalizedArea} />
        )}
      </LocalizedAreaPanelWrapper>
    </>
  )
}

const ZonesList = styled.ul<{ $showZones: boolean; $zonesLength: number }>`
  margin: 0;
  padding: 0;
  overflow: hidden;
  max-height: 50vh;
  height: ${p => (p.$showZones && p.$zonesLength ? 37 * p.$zonesLength : 0)}px;
  background: ${p => p.theme.color.white};
  transition: 0.5s all;
  overflow-y: auto;
`

const ListItem = styled.li`
  cursor: pointer;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`
const LocalizedAreaPanelWrapper = styled.div<{
  $isLayersSidebarVisible: boolean
  $isVigilanceAreaFormOpen: boolean
  $metadataPanelIsOpen: boolean
}>`
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
  position: absolute;
  opacity: ${props => (props.$metadataPanelIsOpen ? 1 : 0)};
  background: ${p => p.theme.color.gainsboro};
  transition: 0.5s all;
  z-index: -1;
`
