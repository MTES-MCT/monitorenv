import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { hideAmpLayer, removeAmpZonesFromMyLayers, showAmpLayer } from '../../../domain/shared_slices/SelectedAmp'
import { RegulatoryLayerLegend } from '../../../ui/RegulatoryLayerLegend'
import { REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT } from '../search/RegulatoryLayer'

import type { AMP } from '../../../domain/entities/AMPs'

export function AMPLayerZone({ amp, isDisplayed }: { amp: AMP; isDisplayed: boolean }) {
  const dispatch = useDispatch()

  const handleRemoveZone = () => dispatch(removeAmpZonesFromMyLayers([amp.id]))
  const zoomToLayerExtent = () => {
    const extent = transformExtent(
      amp.bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    if (!isDisplayed) {
      dispatch(showAmpLayer(amp.id))
    }
    dispatch(setFitToExtent(extent))
  }

  const toggleLayerDisplay = () => {
    if (isDisplayed) {
      dispatch(hideAmpLayer(amp.id))
    } else {
      zoomToLayerExtent()
      dispatch(showAmpLayer(amp.id))
    }
  }

  const displayedName = amp?.name?.replace(/[_]/g, ' ') || 'AUNCUN NOM'

  return (
    <Zone>
      <RegulatoryLayerLegend entity_name={amp?.name} thematique={amp?.designation} />
      <Name title={displayedName}>{displayedName}</Name>
      <Icons>
        <IconButton
          accent={Accent.TERTIARY}
          data-cy={isDisplayed ? 'amp-layers-my-zones-zone-hide' : 'amp-layers-my-zones-zone-show'}
          Icon={Icon.Display}
          onClick={toggleLayerDisplay}
          size={Size.SMALL}
          title={isDisplayed ? 'Cacher la zone' : 'Afficher la zone'}
        />

        <IconButton
          accent={Accent.TERTIARY}
          data-cy="amp-layers-my-zones-zone-delete"
          Icon={Icon.Close}
          onClick={handleRemoveZone}
          size={Size.SMALL}
          title="Supprimer la zone de ma sélection"
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
  font-size: 13px;
  padding-left: 20px;
  background: ${props => props.theme.color.background};
  color: ${COLORS.gunMetal};
  height: ${REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT}px;
  align-items: center;

  :hover {
    background: ${COLORS.blueYonder25};
  }
`

const Icons = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 0;
  margin-right: 4px;
  > * {
    margin-right: 4px;
    margin-left: 4px;
  }
`
