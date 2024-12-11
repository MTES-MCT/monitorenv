import {
  getIsLinkingAMPToVigilanceArea,
  getIsLinkingZonesToVigilanceArea,
  vigilanceAreaActions
} from '@features/VigilanceArea/slice'
import { useAppSelector } from '@hooks/useAppSelector'
import { IconButton, Accent, Size, Icon, THEME, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import styled from 'styled-components'

import { LayerLegend } from './LayerLegend.style'
import { LayerSelector } from './LayerSelector.style'
import { MonitorEnvLayers } from '../../../domain/entities/layers/constants'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../hooks/useAppDispatch'

type MyLayerZoneProps = {
  bbox: number[]
  displayedName: string
  hasMetadata: boolean
  hideLayer: () => void
  id: number
  layerType: MonitorEnvLayers.REGULATORY_ENV | MonitorEnvLayers.AMP
  layerZoneIsShowed: boolean
  metadataIsShown?: boolean
  name: string
  removeZone: () => void
  showLayer: () => void
  toggleZoneMetadata?: () => void
  type: string | undefined
}

export function MyLayerZone({
  bbox,
  displayedName,
  hasMetadata,
  hideLayer,
  id,
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

  const regulatoryAreasLinkedToVigilanceAreaForm = useAppSelector(state => state.vigilanceArea.regulatoryAreasToAdd)
  const ampLinkedToVigilanceAreaForm = useAppSelector(state => state.vigilanceArea.ampToAdd)

  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))

  const isDisabled =
    layerType === MonitorEnvLayers.AMP
      ? ampLinkedToVigilanceAreaForm.includes(id)
      : regulatoryAreasLinkedToVigilanceAreaForm.includes(id)

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

  const handleClickOnLayerName = () => {
    if (layerZoneIsShowed) {
      zoomToLayerExtent()
    }
  }

  const toggleLayerDisplay = () => {
    if (layerZoneIsShowed) {
      hideLayer()
    } else {
      zoomToLayerExtent()
      showLayer()
    }
  }

  const addZoneToVigilanceArea = e => {
    e.stopPropagation()

    if (isLinkingAMPToVigilanceArea) {
      dispatch(vigilanceAreaActions.addAmpIdsToVigilanceArea([id]))

      return
    }
    dispatch(vigilanceAreaActions.addRegulatoryAreasToVigilanceArea([id]))
  }

  return (
    <LayerSelector.Layer $metadataIsShown={metadataIsShown}>
      <LayerLegend layerType={layerType} legendKey={name} type={type} />
      <LayerSelector.Name data-cy={`my-zone-${displayedName}`} onClick={handleClickOnLayerName} title={displayedName}>
        {displayedName}
      </LayerSelector.Name>
      <LayerSelector.IconGroup>
        {isLinkingZonesToVigilanceArea ? (
          <PaddedIconButton
            accent={Accent.TERTIARY}
            disabled={isDisabled}
            Icon={Icon.Plus}
            onClick={addZoneToVigilanceArea}
            title="Ajouter la zone à la zone de vigilance"
          />
        ) : (
          <>
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
              color={THEME.color.slateGray}
              Icon={Icon.Close}
              onClick={removeZone}
              size={Size.SMALL}
              title="Supprimer la zone de ma sélection"
            />
          </>
        )}
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}

const PaddedIconButton = styled(IconButton)`
  margin-right: 8px;
`
