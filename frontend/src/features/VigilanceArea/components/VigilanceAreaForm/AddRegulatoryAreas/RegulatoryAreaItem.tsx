import {
  closeMetadataPanel,
  getMetadataIsOpenForRegulatoryLayerId,
  openRegulatoryMetadataPanel
} from '@features/layersSelector/metadataPanel/slice'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, Size, THEME } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import {
  addRegulatoryZonesToMyLayers,
  hideRegulatoryLayer,
  removeRegulatoryZonesFromMyLayers,
  showRegulatoryLayer
} from 'domain/shared_slices/Regulatory'
import styled from 'styled-components'

import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

type RegulatoryAreaItemProps = {
  deleteRegulatoryArea?: (id: number) => void
  isReadOnly: boolean
  regulatoryArea: RegulatoryLayerCompact | undefined
}
export function RegulatoryAreaItem({ deleteRegulatoryArea, isReadOnly, regulatoryArea }: RegulatoryAreaItemProps) {
  const dispatch = useAppDispatch()

  const regulatoryAreaId = regulatoryArea?.id
  const selectedRegulatoryLayerIds = useAppSelector(state => state.regulatory.selectedRegulatoryLayerIds)
  const regulatoryAreaIdsToBeDisplayed = useAppSelector(state => state.vigilanceArea.regulatoryAreaIdsToBeDisplayed)
  const showedRegulatoryLayerIds = useAppSelector(state => state.regulatory.showedRegulatoryLayerIds)

  const metadataIsShown = useAppSelector(state =>
    regulatoryAreaId ? getMetadataIsOpenForRegulatoryLayerId(state, regulatoryAreaId) : undefined
  )

  const isZoneSelected = regulatoryAreaId ? selectedRegulatoryLayerIds.includes(regulatoryAreaId) : false
  const isLayerVisible = regulatoryAreaId ? regulatoryAreaIdsToBeDisplayed?.includes(regulatoryAreaId) : false
  const pinnedRegulatoryZoneIsShowed = regulatoryAreaId ? showedRegulatoryLayerIds.includes(regulatoryAreaId) : false

  const onDeleteRegulatoryArea = e => {
    e.stopPropagation()
    if (!deleteRegulatoryArea || !regulatoryAreaId) {
      return
    }
    deleteRegulatoryArea(regulatoryAreaId)
  }

  const handleSelectZone = e => {
    e.stopPropagation()
    if (!regulatoryAreaId) {
      return
    }
    if (isZoneSelected) {
      dispatch(removeRegulatoryZonesFromMyLayers([regulatoryAreaId]))
    } else {
      dispatch(addRegulatoryZonesToMyLayers([regulatoryAreaId]))
    }
  }

  const displayRegulatoryArea = e => {
    e.stopPropagation()

    if (!regulatoryAreaId) {
      return
    }

    if (!selectedRegulatoryLayerIds.includes(regulatoryAreaId)) {
      if (isLayerVisible) {
        dispatch(vigilanceAreaActions.removeRegulatoryAreaIdsToBeDisplayed(regulatoryAreaId))
      } else {
        dispatch(vigilanceAreaActions.addRegulatoryAreaIdsToBeDisplayed(regulatoryAreaId))
      }

      return
    }

    if (isLayerVisible || pinnedRegulatoryZoneIsShowed) {
      dispatch(vigilanceAreaActions.removeRegulatoryAreaIdsToBeDisplayed(regulatoryAreaId))
      dispatch(hideRegulatoryLayer(regulatoryAreaId))
    } else {
      dispatch(vigilanceAreaActions.addRegulatoryAreaIdsToBeDisplayed(regulatoryAreaId))
      dispatch(showRegulatoryLayer(regulatoryAreaId))
    }
  }

  const toggleRegulatoryZoneMetadata = id => {
    if (metadataIsShown) {
      dispatch(closeMetadataPanel())
    } else {
      dispatch(openRegulatoryMetadataPanel(id))
    }
  }

  return (
    <RegulatoryAreaContainer
      $isReadOnly={isReadOnly}
      data-cy="regulatory-area-item"
      onClick={() => toggleRegulatoryZoneMetadata(regulatoryAreaId)}
    >
      <RegulatoryAreaName>
        <LayerLegend
          layerType={MonitorEnvLayers.REGULATORY_ENV}
          legendKey={regulatoryArea?.entity_name ?? 'aucun'}
          type={regulatoryArea?.thematique ?? 'aucun'}
        />
        <span title={regulatoryArea?.entity_name}>{regulatoryArea?.entity_name}</span>
      </RegulatoryAreaName>
      {isReadOnly ? (
        <ButtonsContainer>
          <StyledIconButton
            accent={Accent.TERTIARY}
            color={isLayerVisible || pinnedRegulatoryZoneIsShowed ? THEME.color.charcoal : THEME.color.lightGray}
            Icon={Icon.Display}
            onClick={displayRegulatoryArea}
            title={isLayerVisible ? 'Cacher la zone' : 'Afficher la zone'}
          />
          <StyledIconButton
            accent={Accent.TERTIARY}
            color={isZoneSelected ? THEME.color.blueGray : THEME.color.gunMetal}
            Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
            onClick={handleSelectZone}
            title="Ajouter la zone à Mes zones réglementaires"
          />
        </ButtonsContainer>
      ) : (
        <IconButton
          accent={Accent.TERTIARY}
          Icon={Icon.Close}
          onClick={onDeleteRegulatoryArea}
          size={Size.SMALL}
          title={`vigilance-area-delete-regulatory-area-${regulatoryAreaId}`}
        />
      )}
    </RegulatoryAreaContainer>
  )
}

const RegulatoryAreaContainer = styled.div<{ $isReadOnly: boolean }>`
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: space-between;
  padding: 8px;

  ${p =>
    p.$isReadOnly &&
    `
      &:last-child {
        border-bottom: none;
        padding-bottom: 0px;
         }
    `}
`
const RegulatoryAreaName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`
const StyledIconButton = styled(IconButton)`
  padding: 0px;
`
