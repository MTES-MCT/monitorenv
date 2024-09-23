import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { createRef } from 'react'

import { useGetRegulatoryLayersQuery } from '../../../../../api/regulatoryLayersAPI'
import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'

type RegulatoryLayerProps = {
  layerId: number
}

export function Layer({ layerId }: RegulatoryLayerProps) {
  const dispatch = useAppDispatch()
  const ref = createRef<HTMLSpanElement>()

  const selectedRegulatoryLayerIds = useAppSelector(state => state.regulatory.selectedRegulatoryLayerIds)

  const { layer } = useGetRegulatoryLayersQuery(undefined, {
    selectFromResult: result => ({
      layer: result?.currentData?.entities[layerId]
    })
  })

  const isZoneSelected = selectedRegulatoryLayerIds.includes(layerId)

  const handleSelectZone = e => {
    e.stopPropagation()
    // TODO add action
  }

  const toggleZoneMetadata = () => {
    // TODO add action
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

  return (
    <LayerSelector.Layer
      ref={ref}
      // $metadataIsShown={metadataIsShown}
      onClick={toggleZoneMetadata}
    >
      <LayerLegend
        layerType={MonitorEnvLayers.REGULATORY_ENV}
        legendKey={layer?.entity_name ?? 'aucun'}
        type={layer?.thematique ?? 'aucun'}
      />
      <LayerSelector.Name $withLargeWidth onClick={fitToRegulatoryLayer} title={layer?.entity_name}>
        {layer?.entity_name ?? 'AUCUN NOM'}
      </LayerSelector.Name>

      <LayerSelector.IconGroup>
        <IconButton
          accent={Accent.TERTIARY}
          aria-label="Sélectionner la zone"
          color={isZoneSelected ? THEME.color.blueGray : THEME.color.slateGray}
          data-cy="regulatory-zone-check"
          Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
          onClick={handleSelectZone}
        />
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}
