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
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

type RegulatoryAreaItemProps = {
  isReadOnly: boolean
  regulatoryArea: RegulatoryLayerCompact | undefined
}
export function RegulatoryAreaItem({ isReadOnly, regulatoryArea }: RegulatoryAreaItemProps) {
  const dispatch = useAppDispatch()

  const {
    setFieldValue,
    values: { linkedRegulatoryAreas }
  } = useFormikContext<VigilanceArea.VigilanceArea>()

  const regulatoryAreaId = regulatoryArea?.id

  const selectedRegulatoryLayerIds = useAppSelector(state => state.regulatory.selectedRegulatoryLayerIds)
  const showedRegulatoryLayerIds = useAppSelector(state => state.regulatory.showedRegulatoryLayerIds)

  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)
  const regulatoryAreaIdsToBeDisplayed = useAppSelector(state => state.vigilanceArea.regulatoryAreaIdsToBeDisplayed)

  const metadataIsShown = useAppSelector(state =>
    regulatoryAreaId ? getMetadataIsOpenForRegulatoryLayerId(state, regulatoryAreaId) : undefined
  )

  const isZoneSelected = !!(regulatoryAreaId && selectedRegulatoryLayerIds.includes(regulatoryAreaId))
  const isLayerVisible = !!(regulatoryAreaId && regulatoryAreaIdsToBeDisplayed?.includes(regulatoryAreaId))
  const pinnedRegulatoryZoneIsShowed = !!(regulatoryAreaId && showedRegulatoryLayerIds.includes(regulatoryAreaId))

  const deleteRegulatoryArea = e => {
    e.stopPropagation()
    if (!regulatoryAreaId) {
      return
    }
    dispatch(vigilanceAreaActions.deleteRegulatoryAreasFromVigilanceArea(regulatoryAreaId))
    setFieldValue(
      'linkedRegulatoryAreas',
      linkedRegulatoryAreas?.filter(linkedRegulatoryArea => linkedRegulatoryArea !== regulatoryAreaId)
    )
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
        dispatch(vigilanceAreaActions.deleteRegulatoryAreaIdsToBeDisplayed(regulatoryAreaId))
      } else {
        dispatch(vigilanceAreaActions.addRegulatoryAreaIdsToBeDisplayed(regulatoryAreaId))
      }

      return
    }

    if (isLayerVisible || pinnedRegulatoryZoneIsShowed) {
      dispatch(vigilanceAreaActions.deleteRegulatoryAreaIdsToBeDisplayed(regulatoryAreaId))
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
      if (editingVigilanceAreaId) {
        dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
      }
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
          legendKey={regulatoryArea?.entityName ?? 'aucun'}
          type={regulatoryArea?.themes.map(({ name }) => name).join(', ') ?? 'aucun'}
        />
        <span title={regulatoryArea?.entityName}>{regulatoryArea?.entityName}</span>
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
          onClick={deleteRegulatoryArea}
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
  cursor: pointer;

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
  > span {
    margin-left: 8px;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`
const StyledIconButton = styled(IconButton)`
  padding: 0px;
`
