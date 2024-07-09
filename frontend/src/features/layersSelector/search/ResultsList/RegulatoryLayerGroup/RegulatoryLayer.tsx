import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { createRef, useEffect } from 'react'
import Highlighter from 'react-highlight-words'

import { useGetRegulatoryLayersQuery } from '../../../../../api/regulatoryLayersAPI'
import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import {
  addRegulatoryZonesToMyLayers,
  removeRegulatoryZonesFromMyLayers
} from '../../../../../domain/shared_slices/Regulatory'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import {
  closeMetadataPanel,
  getDisplayedMetadataRegulatoryLayerId,
  getMetadataIsOpenForRegulatoryLayerId,
  openRegulatoryMetadataPanel
} from '../../../metadataPanel/slice'
import { LayerLegend } from '../../../utils/LayerLegend.style'
import { LayerSelector } from '../../../utils/LayerSelector.style'

type RegulatoryLayerProps = {
  isLinkingAMPToVigilanceArea: boolean
  isLinkingRegulatoryToVigilanceArea: boolean
  layerId: number
  searchedText: string
}

export function RegulatoryLayer({
  isLinkingAMPToVigilanceArea,
  isLinkingRegulatoryToVigilanceArea,
  layerId,
  searchedText
}: RegulatoryLayerProps) {
  const dispatch = useAppDispatch()
  const ref = createRef<HTMLSpanElement>()

  const selectedRegulatoryLayerIds = useAppSelector(state => state.regulatory.selectedRegulatoryLayerIds)
  const regulatoryAreasLinkedToVigilanceAreaForm = useAppSelector(state => state.vigilanceArea.regulatoryAreasToAdd)
  const AMPsLinkedToVigilanceAreaForm = useAppSelector(state => state.vigilanceArea.AMPToAdd)

  const { layer } = useGetRegulatoryLayersQuery(undefined, {
    selectFromResult: result => ({
      layer: result?.currentData?.entities[layerId]
    })
  })
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))

  const isZoneSelected = selectedRegulatoryLayerIds.includes(layerId)
  const metadataIsShown = useAppSelector(state => getMetadataIsOpenForRegulatoryLayerId(state, layerId))

  const handleSelectZone = e => {
    e.stopPropagation()
    if (isZoneSelected) {
      dispatch(removeRegulatoryZonesFromMyLayers([layerId]))
    } else {
      dispatch(addRegulatoryZonesToMyLayers([layerId]))
    }
  }

  const toggleZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(closeMetadataPanel())
    } else {
      dispatch(openRegulatoryMetadataPanel(layerId))
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

  const addRegulatoryToVigilanceArea = e => {
    e.stopPropagation()
    dispatch(vigilanceAreaActions.addRegulatoryAreasToVigilanceArea([layerId]))
  }

  const addAMPToVigilanceArea = e => {
    e.stopPropagation()
    dispatch(vigilanceAreaActions.addAMPsToVigilanceArea([layerId]))
  }

  useEffect(() => {
    if (layerId === regulatoryMetadataLayerId && ref?.current) {
      ref.current.scrollIntoView(false)
    }
  }, [layerId, regulatoryMetadataLayerId, ref])

  return (
    <LayerSelector.Layer
      ref={ref}
      $metadataIsShown={metadataIsShown}
      data-cy="regulatory-result-zone"
      onClick={toggleZoneMetadata}
    >
      <LayerLegend
        layerType={MonitorEnvLayers.REGULATORY_ENV}
        legendKey={layer?.entity_name ?? 'aucun'}
        type={layer?.thematique ?? 'aucun'}
      />
      <LayerSelector.Name onClick={fitToRegulatoryLayer} title={layer?.entity_name}>
        <Highlighter
          autoEscape
          highlightClassName="highlight"
          searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
          textToHighlight={layer?.entity_name ?? ''}
        />
        {!layer?.entity_name && 'AUCUN NOM'}
      </LayerSelector.Name>
      <LayerSelector.IconGroup>
        {isLinkingRegulatoryToVigilanceArea && (
          <IconButton
            accent={Accent.TERTIARY}
            aria-label="Ajouter la zone réglentaire à la zone de vigilance"
            data-cy="regulatory-zone-add"
            disabled={regulatoryAreasLinkedToVigilanceAreaForm?.includes(layerId)}
            Icon={Icon.Plus}
            onClick={addRegulatoryToVigilanceArea}
          />
        )}
        {isLinkingAMPToVigilanceArea && (
          <IconButton
            accent={Accent.TERTIARY}
            aria-label="Ajouter la zone AMP à la zone de vigilance"
            data-cy="amp-zone-add"
            disabled={AMPsLinkedToVigilanceAreaForm?.includes(layerId)}
            Icon={Icon.Plus}
            onClick={addAMPToVigilanceArea}
          />
        )}
        {!isLinkingRegulatoryToVigilanceArea && !isLinkingAMPToVigilanceArea && (
          <IconButton
            accent={Accent.TERTIARY}
            aria-label="Sélectionner la zone"
            color={isZoneSelected ? THEME.color.blueGray : THEME.color.gunMetal}
            data-cy="regulatory-zone-check"
            Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
            onClick={handleSelectZone}
          />
        )}
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}
