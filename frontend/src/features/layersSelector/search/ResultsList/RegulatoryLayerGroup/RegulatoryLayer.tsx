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
import {
  closeRegulatoryMetadataPanel,
  openRegulatoryMetadataPanel
} from '../../../../../domain/shared_slices/RegulatoryMetadata'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { LayerLegend } from '../../../utils/LayerLegend.style'
import { LayerSelector } from '../../../utils/LayerSelector.style'

export function RegulatoryLayer({ layerId, searchedText }: { layerId: number; searchedText: string }) {
  const dispatch = useAppDispatch()

  const selectedRegulatoryLayerIds = useAppSelector(state => state.regulatory.selectedRegulatoryLayerIds)
  const { layer } = useGetRegulatoryLayersQuery(undefined, {
    selectFromResult: result => ({
      layer: result?.currentData?.entities[layerId]
    })
  })
  const regulatoryMetadataLayerId = useAppSelector(state => state.regulatoryMetadata.regulatoryMetadataLayerId)
  const regulatoryMetadataPanelIsOpen = useAppSelector(state => state.regulatoryMetadata.regulatoryMetadataPanelIsOpen)

  const isZoneSelected = selectedRegulatoryLayerIds.includes(layerId)
  const metadataIsShown = regulatoryMetadataPanelIsOpen && layerId === regulatoryMetadataLayerId

  const ref = createRef<HTMLSpanElement>()

  const handleSelectZone = e => {
    e.stopPropagation()
    if (isZoneSelected) {
      dispatch(removeRegulatoryZonesFromMyLayers([layerId]))
    } else {
      dispatch(addRegulatoryZonesToMyLayers([layerId]))
    }
  }

  const toggleRegulatoryZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(closeRegulatoryMetadataPanel())
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
      onClick={toggleRegulatoryZoneMetadata}
    >
      <LayerLegend
        layerType={MonitorEnvLayers.REGULATORY_ENV}
        name={layer?.entity_name ?? 'aucun'}
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
        <IconButton
          accent={Accent.TERTIARY}
          aria-label="Sélectionner la zone"
          color={isZoneSelected ? THEME.color.blueGray : THEME.color.gunMetal}
          data-cy="regulatory-zone-check"
          Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
          onClick={handleSelectZone}
        />
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}
