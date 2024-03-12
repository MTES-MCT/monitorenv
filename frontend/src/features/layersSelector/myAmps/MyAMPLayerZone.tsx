import { MonitorEnvLayers } from '../../../domain/entities/layers/constants'
import { hideAmpLayer, removeAmpZonesFromMyLayers, showAmpLayer } from '../../../domain/shared_slices/SelectedAmp'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { MyLayerZone } from '../utils/MyLayerZone'

import type { AMP } from '../../../domain/entities/AMPs'

export function MyAMPLayerZone({ amp, isDisplayed }: { amp: AMP; isDisplayed: boolean }) {
  const dispatch = useAppDispatch()

  const handleRemoveZone = () => dispatch(removeAmpZonesFromMyLayers([amp.id]))

  const displayedName = amp?.type?.replace(/[_]/g, ' ') || 'AUNCUN NOM'

  return (
    <MyLayerZone
      bbox={amp.bbox}
      displayedName={displayedName}
      hasMetadata={false}
      hideLayer={() => dispatch(hideAmpLayer(amp.id))}
      layerType={MonitorEnvLayers.AMP}
      layerZoneIsShowed={isDisplayed}
      name={amp.name}
      removeZone={handleRemoveZone}
      showLayer={() => dispatch(showAmpLayer(amp.id))}
      type={amp.type}
    />
  )
}
