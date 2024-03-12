import { IconButton, Accent, Size, Icon, THEME } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import styled from 'styled-components'

import { LayerLegend } from './LayerLegend.style'
import { LayerSelector } from './LayerSelector.style'
import { MonitorEnvLayers } from '../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../hooks/useAppDispatch'

type MyLayerZoneProps = {
  bbox: number[]
  displayedName: string
  hasMetadata: boolean
  hideLayer: () => void
  layerType: MonitorEnvLayers.REGULATORY_ENV | MonitorEnvLayers.AMP
  layerZoneIsShowed: boolean
  metadataIsShown?: boolean
  name: string
  removeZone: () => void
  showLayer: () => void
  toggleZoneMetadata?: () => void
  type: string
}

export function MyLayerZone({
  bbox,
  displayedName,
  hasMetadata,
  hideLayer,
  layerType,
  layerZoneIsShowed,
  metadataIsShown,
  name,
  removeZone,
  showLayer,
  toggleZoneMetadata,
  type
}: MyLayerZoneProps) {
  const dispatch = useAppDispatch()

  const zoomToLayerExtent = () => {
    const extent = transformExtent(
      bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    if (!layerZoneIsShowed) {
      showLayer()
    }
    dispatch(setFitToExtent(extent))
  }

  const toggleLayerDisplay = () => {
    if (layerZoneIsShowed) {
      hideLayer()
    } else {
      zoomToLayerExtent()
      showLayer()
    }
  }

  return (
    <LayerSelector.Layer $selected={metadataIsShown}>
      <LayerLegend layerType={layerType} name={name} type={type} />
      <LayerSelector.Name title={displayedName}>{displayedName}</LayerSelector.Name>
      <LayerSelector.IconGroup>
        {hasMetadata && (
          <IconButton
            accent={Accent.TERTIARY}
            color={metadataIsShown ? THEME.color.charcoal : THEME.color.lightGray}
            Icon={Icon.Summary}
            iconSize={20}
            onClick={toggleZoneMetadata}
            size={Size.SMALL}
            title={metadataIsShown ? 'Fermer la réglementation' : 'Afficher la réglementation'}
          />
        )}

        <IconButton
          accent={Accent.TERTIARY}
          color={layerZoneIsShowed ? THEME.color.charcoal : THEME.color.lightGray}
          Icon={Icon.Display}
          onClick={toggleLayerDisplay}
          title={layerZoneIsShowed ? 'Cacher la zone' : 'Afficher la zone'}
        />

        <PaddedIconButton
          accent={Accent.TERTIARY}
          color={THEME.color.lightGray}
          Icon={Icon.Close}
          onClick={removeZone}
          size={Size.SMALL}
          title="Supprimer la zone de ma sélection"
        />
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}

const PaddedIconButton = styled(IconButton)`
  margin-right: 8px;
`
