import { getExtentOfLocalizedAreasGroupByGroupName } from '@api/localizedAreasAPI'
import { closeMetadataPanel, openLocalizedAreasMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { Accent, Icon, IconButton, Size, THEME } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { setFitToExtent } from 'domain/shared_slices/Map'
import styled from 'styled-components'

import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { localizedAreaActions } from '../slice'

import type { LocalizedArea } from '../types'

export function LocalizedAreasItem({
  groupName,
  localizedAreas
}: {
  groupName: string
  localizedAreas: LocalizedArea.LocalizedArea[]
}) {
  const dispatch = useAppDispatch()
  const { metadataLayerId } = useAppSelector(state => state.layersMetadata)
  const { showedLocalizedAreaLayerIds } = useAppSelector(state => state.localizedArea)

  const groupExtent = useAppSelector(state => getExtentOfLocalizedAreasGroupByGroupName(state, groupName))

  const firstLocalizedArea = localizedAreas[0]
  const localizedAreaIds = localizedAreas.map(localizedArea => localizedArea.id)
  if (!firstLocalizedArea) {
    return null
  }

  const isLayerVisible = localizedAreaIds.some(id => showedLocalizedAreaLayerIds.includes(id))

  const toggleLayer = e => {
    e.stopPropagation()
    if (isLayerVisible) {
      dispatch(localizedAreaActions.hideLocalizedAreaLayer(localizedAreaIds))
    } else {
      dispatch(localizedAreaActions.showLocalizedAreaLayer(localizedAreaIds))
      dispatch(setFitToExtent(groupExtent))
    }
  }
  const toggleSummary = e => {
    e.stopPropagation()
    if (groupName === metadataLayerId) {
      dispatch(closeMetadataPanel())
    } else {
      dispatch(openLocalizedAreasMetadataPanel(groupName))
    }
  }

  return (
    <Row data-cy="localized-areas-layer-toggle" onClick={toggleLayer}>
      <NameContainer>
        <LayerLegend
          layerType={MonitorEnvLayers.LOCALIZED_AREAS}
          legendKey={firstLocalizedArea.name}
          type={firstLocalizedArea.groupName}
        />
        <LayerName title={firstLocalizedArea.groupName}>{firstLocalizedArea.groupName}</LayerName>
      </NameContainer>
      <ButtonsContainer>
        <IconButton
          accent={Accent.TERTIARY}
          color={metadataLayerId === groupName ? THEME.color.charcoal : THEME.color.lightGray}
          Icon={Icon.Summary}
          iconSize={20}
          onClick={toggleSummary}
          size={Size.SMALL}
          title={metadataLayerId === groupName ? 'Fermer la réglementation' : 'Afficher la réglementation'}
        />
        <IconButton
          accent={Accent.TERTIARY}
          color={isLayerVisible ? THEME.color.charcoal : THEME.color.lightGray}
          Icon={Icon.Display}
          iconSize={20}
          onClick={toggleLayer}
          size={Size.SMALL}
          title={isLayerVisible ? 'Masquer le secteur local' : 'Afficher le secteur local'}
        />
      </ButtonsContainer>
    </Row>
  )
}

const LayerName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Row = styled.span`
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px 6px 20px;
  user-select: none;

  &:hover {
    background: ${p => p.theme.color.blueYonder25};
  }
`

const NameContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const ButtonsContainer = styled.div`
  display: flex;
`
