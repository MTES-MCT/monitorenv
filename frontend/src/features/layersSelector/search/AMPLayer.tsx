import { Accent, Icon, Size, IconButton } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import Highlighter from 'react-highlight-words'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { COLORS } from '../../../constants/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { addAmpZonesToMyLayers, removeAmpZonesFromMyLayers } from '../../../domain/shared_slices/SelectedAmp'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { RegulatoryLayerLegend } from '../../../ui/RegulatoryLayerLegend'

export const REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT = 36

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
    <Zone>
      <RegulatoryLayerLegend entity_name={layer?.name} thematique={layer?.designation} />
      <Name onClick={fitToRegulatoryLayer} title={layer?.designation}>
        <Highlighter
          autoEscape
          highlightClassName="highlight"
          searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
          textToHighlight={layer?.designation || ''}
        />
        {!layer?.designation && 'AUCUN NOM'}
      </Name>
      <Icons>
        <IconButton
          accent={Accent.TERTIARY}
          aria-label="Sélectionner la zone"
          color={isZoneSelected ? 'blue' : 'grey'}
          Icon={Icon.Pin}
          iconSize={20}
          onClick={handleSelectRegulatoryZone}
          size={Size.SMALL}
        />
      </Icons>
    </Zone>
  )
}

const Name = styled.span`
  width: 280px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden !important;
  font-size: inherit;
  text-align: left;
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const Zone = styled.span`
  user-select: none;
  display: flex;
  text-align: left;
  font-size: 13px;
  padding-left: 20px;
  background: ${COLORS.ampBackground};
  color: ${p => p.theme.color.gunMetal};
  height: ${REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT}px;
  align-items: center;

  :hover {
    background: ${p => p.theme.color.blueYonder25};
  }
`

const Icons = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 0;
  margin-right: 4px;
`
