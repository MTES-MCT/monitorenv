import { StyledTransparentButton } from '@components/style'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import { getIsLinkingRegulatoryToVigilanceArea, vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getRegulatoryAreaTitle } from '@utils/getRegulatoryAreaTitle'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { createRef, useEffect } from 'react'
import Highlighter from 'react-highlight-words'

import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
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
  layer: RegulatoryArea.RegulatoryAreaFromAPI
  searchedText: string
}

export function RegulatoryLayer({ layer, searchedText }: RegulatoryLayerProps) {
  const dispatch = useAppDispatch()
  const ref = createRef<HTMLLIElement>()

  const selectedRegulatoryLayerIds = useAppSelector(state => state.regulatory.selectedRegulatoryLayerIds)

  const regulatoryAreasLinkedToVigilanceAreaForm = useAppSelector(state => state.vigilanceArea.regulatoryAreasToAdd)
  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))

  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))

  const isZoneSelected = selectedRegulatoryLayerIds.includes(layer.id)
  const metadataIsShown = useAppSelector(state => getMetadataIsOpenForRegulatoryLayerId(state, layer.id))

  const handleSelectZone = e => {
    e.stopPropagation()
    if (isZoneSelected) {
      dispatch(removeRegulatoryZonesFromMyLayers([layer.id]))
    } else {
      dispatch(addRegulatoryZonesToMyLayers([layer.id]))
    }
  }

  const toggleZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(closeMetadataPanel())
    } else {
      dispatch(openRegulatoryMetadataPanel(layer.id))
      fitToRegulatoryLayer()
    }
  }

  const fitToRegulatoryLayer = () => {
    if (!layer?.extent) {
      return
    }
    const extent = transformExtent(
      layer?.extent,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(setFitToExtent(extent))
  }

  const addRegulatoryToVigilanceArea = e => {
    e.stopPropagation()
    dispatch(vigilanceAreaActions.addRegulatoryAreasToVigilanceArea([layer.id]))
  }

  useEffect(() => {
    let timeout: number | undefined

    if (layer.id === regulatoryMetadataLayerId && ref?.current) {
      timeout = window.setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [layer.id, regulatoryMetadataLayerId, ref])

  const layerTitle = getRegulatoryAreaTitle(layer?.polyName, layer?.resume)

  return (
    <LayerSelector.Layer
      ref={ref}
      $isNew={layer?.isNew}
      $isRecentlyUpdated={layer?.isUpdatedRecently}
      $metadataIsShown={metadataIsShown}
      data-cy="regulatory-result-zone"
    >
      <StyledTransparentButton onClick={toggleZoneMetadata}>
        <LayerLegend
          layerType={MonitorEnvLayers.REGULATORY_ENV}
          legendKey={layerTitle ?? 'aucun'}
          plan={layer?.plan}
          type={layer?.tags?.map(({ name }) => name).join(', ') ?? 'aucun'}
        />
        <LayerSelector.Name title={layerTitle}>
          <Highlighter
            autoEscape
            highlightClassName="highlight"
            searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
            textToHighlight={layerTitle ?? ''}
          />
          {!layerTitle && 'AUCUN NOM'}
        </LayerSelector.Name>
      </StyledTransparentButton>

      <LayerSelector.IconGroup>
        {isLinkingRegulatoryToVigilanceArea ? (
          <IconButton
            accent={Accent.TERTIARY}
            data-cy="regulatory-zone-add"
            disabled={regulatoryAreasLinkedToVigilanceAreaForm.includes(layer.id)}
            Icon={Icon.Plus}
            onClick={addRegulatoryToVigilanceArea}
            title="Ajouter la zone réglementaire à la zone de vigilance"
          />
        ) : (
          <IconButton
            accent={Accent.TERTIARY}
            color={isZoneSelected ? THEME.color.blueGray : THEME.color.gunMetal}
            data-cy="regulatory-zone-check"
            Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
            onClick={handleSelectZone}
            title="Sélectionner la zone"
          />
        )}
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}
