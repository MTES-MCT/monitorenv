import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { createRef, useEffect } from 'react'
import Highlighter from 'react-highlight-words'

import { useGetAMPsQuery } from '../../../../../api/ampsAPI'
import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import {
  addAmpZonesToMyLayers,
  removeAmpZonesFromMyLayers,
  setSelectedAmpLayerId
} from '../../../../../domain/shared_slices/SelectedAmp'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { LayerLegend } from '../../../utils/LayerLegend.style'
import { LayerSelector } from '../../../utils/LayerSelector.style'

export function AMPLayer({ layerId, searchedText }: { layerId: number; searchedText: string }) {
  const dispatch = useAppDispatch()
  const ref = createRef<HTMLSpanElement>()

  const { layer } = useGetAMPsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      layer: data?.entities[layerId]
    })
  })
  const selectedAmpLayerId = useAppSelector(state => state.selectedAmp.selectedAmpLayerId)
  const selectedAmpLayerIds = useAppSelector(state => state.selectedAmp.selectedAmpLayerIds)

  const isZoneSelected = selectedAmpLayerIds.includes(layerId)

  const handleSelectZone = e => {
    e.stopPropagation()
    if (isZoneSelected) {
      dispatch(removeAmpZonesFromMyLayers([layerId]))
    } else {
      dispatch(addAmpZonesToMyLayers([layerId]))
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
    dispatch(setSelectedAmpLayerId(layerId))
  }

  useEffect(() => {
    if (selectedAmpLayerId === layerId && ref?.current) {
      ref.current.scrollIntoView(false)
    }
  }, [selectedAmpLayerId, ref, layerId])

  return (
    <LayerSelector.Layer ref={ref} $selected={selectedAmpLayerId === layerId}>
      <LayerLegend layerType={MonitorEnvLayers.AMP} name={layer?.name ?? 'aucun'} type={layer?.type ?? 'aucun'} />
      <LayerSelector.Name data-cy="amp-layer-type" onClick={fitToRegulatoryLayer} title={layer?.type}>
        <Highlighter
          autoEscape
          highlightClassName="highlight"
          searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
          textToHighlight={layer?.type ?? ''}
        />
        {!layer?.type && 'AUCUN TYPE'}
      </LayerSelector.Name>
      <LayerSelector.IconGroup>
        <IconButton
          accent={Accent.TERTIARY}
          aria-label="Sélectionner la zone"
          color={isZoneSelected ? THEME.color.blueGray : THEME.color.gunMetal}
          data-cy="amp-zone-check"
          Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
          onClick={handleSelectZone}
        />
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}
