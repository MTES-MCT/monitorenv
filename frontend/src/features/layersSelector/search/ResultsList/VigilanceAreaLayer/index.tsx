import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { createRef, useEffect } from 'react'
import Highlighter from 'react-highlight-words'

import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { LayerLegend } from '../../../utils/LayerLegend.style'
import { LayerSelector } from '../../../utils/LayerSelector.style'

type RegulatoryLayerProps = {
  layerId: number
  searchedText: string
}

export function VigilanceAreaLayer({ layerId, searchedText }: RegulatoryLayerProps) {
  const dispatch = useAppDispatch()
  const ref = createRef<HTMLSpanElement>()

  const myVigilanceAreaIds = useAppSelector(state => state.vigilanceArea.myVigilanceAreaIds)
  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)

  const isZoneSelected = myVigilanceAreaIds.includes(layerId)
  const metadataIsShown = layerId === selectedVigilanceAreaId

  const { layer } = useGetVigilanceAreasQuery(undefined, {
    selectFromResult: result => ({
      layer: result?.data?.entities[layerId]
    })
  })

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
      ref.current.scrollIntoView(false)
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
