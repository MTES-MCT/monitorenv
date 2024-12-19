import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppSelector } from '@hooks/useAppSelector'
import { IconButton, Accent, Size, Icon, THEME, WSG84_PROJECTION, OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import styled from 'styled-components'

import { MonitorEnvLayers } from '../../../domain/entities/layers/constants'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { LayerLegend } from '../utils/LayerLegend.style'
import { LayerSelector } from '../utils/LayerSelector.style'

export function MyVigilanceAreaLayerZone({
  layerId,
  pinnedVigilanceArea = false
}: {
  layerId: number
  pinnedVigilanceArea?: boolean
}) {
  const dispatch = useAppDispatch()

  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)
  const myVigilanceAreaIdsDisplayed = useAppSelector(state => state.vigilanceArea.myVigilanceAreaIdsDisplayed)

  const layerZoneIsShowed = myVigilanceAreaIdsDisplayed.includes(layerId)
  const metadataIsShown = layerId === selectedVigilanceAreaId

  const { layer } = useGetVigilanceAreasQuery(undefined, {
    selectFromResult: result => ({
      layer: layerId ? result?.data?.entities[layerId] : undefined
    })
  })

  const zoomToLayerExtent = () => {
    if (!layerZoneIsShowed) {
      dispatch(vigilanceAreaActions.addIdsToMyVigilanceAreaIdsToBeDisplayed([layerId]))
    }

    if ((layer?.bbox ?? []).length === 0) {
      return
    }

    const extent = transformExtent(
      layer?.bbox ?? [],
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(setFitToExtent(extent))
  }

  const toggleLayerDisplay = () => {
    if (layerZoneIsShowed) {
      dispatch(vigilanceAreaActions.deleteIdToMyVigilanceAreaIdsToBeDisplayed(layerId))
    } else {
      zoomToLayerExtent()
    }
  }

  const toggleZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
    } else {
      dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(layerId))
    }
  }

  const removeZone = () => {
    dispatch(vigilanceAreaActions.deleteIdToMyVigilanceAreaIds(layerId))
  }

  return (
    <LayerSelector.Layer $metadataIsShown={metadataIsShown} $withBorderBottom>
      <LayerLegend
        isDisabled={layer?.isArchived}
        layerType={MonitorEnvLayers.VIGILANCE_AREA}
        legendKey={layer?.comments ?? 'aucun nom'}
        type={layer?.name ?? 'aucun nom'}
      />
      <LayerSelector.Name
        data-cy={`vigilance-area-zone-${layer?.name}`}
        onClick={zoomToLayerExtent}
        title={layer?.name}
      >
        {layer?.name}
      </LayerSelector.Name>

      <LayerSelector.IconGroup>
        <StyledSummaryButton
          $withMargin={pinnedVigilanceArea}
          accent={Accent.TERTIARY}
          color={metadataIsShown ? THEME.color.charcoal : THEME.color.lightGray}
          Icon={Icon.Summary}
          iconSize={20}
          onClick={toggleZoneMetadata}
          size={Size.SMALL}
          title={metadataIsShown ? 'Fermer la zone de vigilance' : 'Afficher la zone de vigilance'}
        />

        <StyledDisplayButton
          $withMargin={pinnedVigilanceArea}
          accent={Accent.TERTIARY}
          color={layerZoneIsShowed ? THEME.color.charcoal : THEME.color.lightGray}
          Icon={Icon.Display}
          onClick={toggleLayerDisplay}
          title={layerZoneIsShowed ? 'Cacher la zone' : 'Afficher la zone'}
        />
        {pinnedVigilanceArea && (
          <StyledRemoveButton
            accent={Accent.TERTIARY}
            color={THEME.color.slateGray}
            Icon={Icon.Close}
            onClick={removeZone}
            size={Size.SMALL}
            title="Supprimer la zone de ma sélection"
          />
        )}
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}

const StyledRemoveButton = styled(IconButton)`
  margin-right: 8px;
`

const StyledDisplayButton = styled(IconButton)<{ $withMargin: boolean }>`
  ${p => !p.$withMargin && `margin-right: 4px;`}
`
const StyledSummaryButton = styled(IconButton)<{ $withMargin: boolean }>`
  ${p => !p.$withMargin && `margin-right: -3px;`}
`
