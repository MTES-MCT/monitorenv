import {
  closeMetadataPanel,
  getDisplayedMetadataAMPLayerId,
  getMetadataIsOpenForAMPLayerId,
  openAMPMetadataPanel
} from '@features/layersSelector/metadataPanel/slice'
import { StyledTransparentButton } from '@features/layersSelector/search'
import { getIsLinkingAMPToVigilanceArea, vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { createRef, useEffect } from 'react'
import Highlighter from 'react-highlight-words'

import { useGetAMPsQuery } from '../../../../../api/ampsAPI'
import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { addAmpZonesToMyLayers, removeAmpZonesFromMyLayers } from '../../../../../domain/shared_slices/Amp'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { LayerLegend } from '../../../utils/LayerLegend.style'
import { LayerSelector } from '../../../utils/LayerSelector.style'

export function AMPLayer({ layerId, searchedText }: { layerId: number; searchedText: string }) {
  const dispatch = useAppDispatch()
  const ref = createRef<HTMLLIElement>()

  const selectedAmpLayerIds = useAppSelector(state => state.amp.selectedAmpLayerIds)
  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const ampsLinkedToVigilanceAreaForm = useAppSelector(state => state.vigilanceArea.ampToAdd)

  const { layer } = useGetAMPsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      layer: data?.entities[layerId]
    })
  })
  const ampMetadataLayerId = useAppSelector(state => getDisplayedMetadataAMPLayerId(state))

  const isZoneSelected = selectedAmpLayerIds.includes(layerId)
  const metadataIsShown = useAppSelector(state => getMetadataIsOpenForAMPLayerId(state, layerId))

  const handleSelectZone = e => {
    e.stopPropagation()
    if (isZoneSelected) {
      dispatch(removeAmpZonesFromMyLayers([layerId]))
    } else {
      dispatch(addAmpZonesToMyLayers([layerId]))
    }
  }

  const toggleZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(closeMetadataPanel())
    } else {
      dispatch(openAMPMetadataPanel(layerId))
    }
  }

  const fitToRegulatoryLayer = () => {
    if (!layer?.bbox) {
      return
    }
    const extent = transformExtent(
      layer?.bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(setFitToExtent(extent))
  }

  const addAMPToVigilanceArea = e => {
    e.stopPropagation()
    dispatch(vigilanceAreaActions.addAmpIdsToVigilanceArea([layerId]))
  }

  useEffect(() => {
    if (ampMetadataLayerId === layerId && ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [ampMetadataLayerId, ref, layerId])

  return (
    <LayerSelector.Layer ref={ref} $metadataIsShown={metadataIsShown} onClick={toggleZoneMetadata}>
      <StyledTransparentButton>
        <LayerLegend layerType={MonitorEnvLayers.AMP} legendKey={layer?.name} type={layer?.type} />
        <LayerSelector.Name data-cy="amp-layer-type" onClick={fitToRegulatoryLayer} title={layer?.type ?? 'aucun'}>
          <Highlighter
            autoEscape
            highlightClassName="highlight"
            searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
            textToHighlight={layer?.type ?? ''}
          />
          {!layer?.type && 'AUCUN NOM'}
        </LayerSelector.Name>
      </StyledTransparentButton>
      <LayerSelector.IconGroup>
        {isLinkingAMPToVigilanceArea ? (
          <IconButton
            accent={Accent.TERTIARY}
            data-cy="amp-zone-add"
            disabled={ampsLinkedToVigilanceAreaForm.includes(layerId)}
            Icon={Icon.Plus}
            onClick={addAMPToVigilanceArea}
            title="Ajouter la zone AMP à la zone de vigilance"
          />
        ) : (
          <IconButton
            accent={Accent.TERTIARY}
            color={isZoneSelected ? THEME.color.blueGray : THEME.color.gunMetal}
            data-cy="amp-zone-check"
            Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
            onClick={handleSelectZone}
            title="Sélectionner la zone"
          />
        )}
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}
