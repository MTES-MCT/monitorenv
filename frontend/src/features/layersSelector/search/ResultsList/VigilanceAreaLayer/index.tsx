import { StyledTransparentButton } from '@features/layersSelector/search'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useTracking } from '@hooks/useTracking'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
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

  const ref = createRef<HTMLLIElement>()

  const { trackEvent } = useTracking()
  const isSuperUser = useAppSelector(state => state.account.isSuperUser)

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
      if (!isSuperUser) {
        trackEvent({
          action: 'Consultation Zone de Vigilance',
          category: 'MONITOR_EXT',
          name: 'Consultation Zone de Vigilance'
        })
      }
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
    let timeout: number | undefined

    if (layerId === selectedVigilanceAreaId && ref?.current) {
      timeout = window.setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [layerId, selectedVigilanceAreaId, ref])

  return (
    <LayerSelector.Layer
      ref={ref}
      $metadataIsShown={metadataIsShown}
      $withBorderBottom
      data-cy="vigilance-area-result-zone"
      onClick={toggleZoneMetadata}
    >
      <StyledTransparentButton>
        <LayerLegend
          isDisabled={layer?.isArchived}
          layerType={MonitorEnvLayers.VIGILANCE_AREA}
          legendKey={layer?.comments}
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
      </StyledTransparentButton>

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
