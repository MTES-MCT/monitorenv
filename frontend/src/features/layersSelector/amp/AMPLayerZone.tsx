import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { useDispatch } from 'react-redux'

import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { hideAmpLayer, removeAmpZonesFromMyLayers, showAmpLayer } from '../../../domain/shared_slices/SelectedAmp'
import { RegulatoryLayerLegend } from '../../../ui/RegulatoryLayerLegend'
import { LayerSelector } from '../utils/LayerSelector.style'

import type { AMP } from '../../../domain/entities/AMPs'

export const AMP_LAYER_ZONE_HEIGHT = 36

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

  const displayedName = amp?.designation?.replace(/[_]/g, ' ') || 'AUNCUN NOM'

  return (
    <LayerSelector.Layer>
      <RegulatoryLayerLegend entity_name={amp?.name} thematique={amp?.designation} />
      <LayerSelector.LayerName title={displayedName}>{displayedName}</LayerSelector.LayerName>
      <LayerSelector.IconGroup>
        <IconButton
          accent={Accent.TERTIARY}
          data-cy={isDisplayed ? 'amp-layers-my-zones-zone-hide' : 'amp-layers-my-zones-zone-show'}
          Icon={Icon.Display}
          iconSize={20}
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
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}
