import { Accent, Icon, Size, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import Highlighter from 'react-highlight-words'
import { useDispatch } from 'react-redux'

import { useGetAMPsQuery } from '../../../../../api/ampsAPI'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import { addAmpZonesToMyLayers, removeAmpZonesFromMyLayers } from '../../../../../domain/shared_slices/SelectedAmp'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { AMPLayerLegend } from '../../../utils/LayerLegend.style'
import { LayerSelector } from '../../../utils/LayerSelector.style'

export function AMPLayer({ layerId, searchedText }: { layerId: number; searchedText: string }) {
  const dispatch = useDispatch()
  const { layer } = useGetAMPsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      layer: data?.entities[layerId]
    })
  })
  const { selectedAmpLayerIds } = useAppSelector(state => state.selectedAmp)
  const isZoneSelected = selectedAmpLayerIds.includes(layerId)

  const handleSelectRegulatoryZone = e => {
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
  }

  return (
    <LayerSelector.Layer>
      <AMPLayerLegend name={layer?.name} type={layer?.type} />
      <LayerSelector.Name onClick={fitToRegulatoryLayer} title={layer?.type}>
        <Highlighter
          autoEscape
          highlightClassName="highlight"
          searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
          textToHighlight={layer?.type || ''}
        />
        {!layer?.type && 'AUCUN TYPE'}
      </LayerSelector.Name>
      <LayerSelector.IconGroup>
        <IconButton
          accent={Accent.TERTIARY}
          aria-label="Sélectionner la zone"
          color={isZoneSelected ? THEME.color.blueGray[100] : THEME.color.gunMetal}
          Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
          iconSize={20}
          onClick={handleSelectRegulatoryZone}
          size={Size.SMALL}
        />
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}
