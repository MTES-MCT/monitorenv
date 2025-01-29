import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { Accent, Icon, IconButton, THEME, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { createRef, useEffect } from 'react'
import Highlighter from 'react-highlight-words'

import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { LayerLegend } from '../../../utils/LayerLegend.style'
import { LayerSelector } from '../../../utils/LayerSelector.style'

import type { VigilanceArea } from '@features/VigilanceArea/types'

type RegulatoryLayerProps = {
  layer: VigilanceArea.VigilanceAreaLayer
  searchedText: string
}

export function VigilanceAreaLayer({ layer, searchedText }: RegulatoryLayerProps) {
  const dispatch = useAppDispatch()
  const ref = createRef<HTMLSpanElement>()

  const myVigilanceAreaIds = useAppSelector(state => state.vigilanceArea.myVigilanceAreaIds)
  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)

  const layerId = layer?.id
  const isZoneSelected = myVigilanceAreaIds.includes(layerId)
  const metadataIsShown = layerId === selectedVigilanceAreaId

  const handleSelectZone = e => {
    e.stopPropagation()
    if (isZoneSelected) {
      dispatch(vigilanceAreaActions.deleteIdToMyVigilanceAreaIds(layerId))
    } else {
      dispatch(vigilanceAreaActions.addIdsToMyVigilanceAreaIds([layerId]))
    }
  }

  const toggleZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(undefined))
    } else {
      dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(layerId))
    }
  }

  const fitToVigilanceAreaLayer = () => {
    if (!layer?.bbox || layer.bbox.length === 0) {
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
    if (layerId === selectedVigilanceAreaId && ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [layerId, ref, selectedVigilanceAreaId])

  return (
    <LayerSelector.Layer
      ref={ref}
      $metadataIsShown={metadataIsShown}
      $withBorderBottom
      data-cy="vigilance-area-result-zone"
      onClick={toggleZoneMetadata}
    >
      <LayerLegend
        isDisabled={layer?.isArchived}
        layerType={MonitorEnvLayers.VIGILANCE_AREA}
        legendKey={layer?.comments ?? 'aucun'}
        type={layer?.name ?? 'aucun'}
      />
      <LayerSelector.Name onClick={fitToVigilanceAreaLayer} title={layer?.name}>
        <Highlighter
          autoEscape
          highlightClassName="highlight"
          searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
          textToHighlight={layer?.name ?? ''}
        />
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
