import { useAppSelector } from '@hooks/useAppSelector'

import { MonitorEnvLayers } from '../../../domain/entities/layers/constants'
import { hideAmpLayer, removeAmpZonesFromMyLayers, showAmpLayer } from '../../../domain/shared_slices/SelectedAmp'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { closeMetadataPanel, getMetadataIsOpenForAMPLayerId, openAMPMetadataPanel } from '../metadataPanel/slice'
import { MyLayerZone } from '../utils/MyLayerZone'

import type { AMP } from '../../../domain/entities/AMPs'

export function MyAMPLayerZone({ amp, isDisplayed }: { amp: AMP; isDisplayed: boolean }) {
  const dispatch = useAppDispatch()

  const metadataIsShown = useAppSelector(state => getMetadataIsOpenForAMPLayerId(state, amp.id))

  const handleRemoveZone = () => dispatch(removeAmpZonesFromMyLayers([amp.id]))

  const displayedName = amp?.type?.replace(/[_]/g, ' ') || 'AUNCUN NOM'

  const toggleRegulatoryZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(closeMetadataPanel())
    } else {
      dispatch(openAMPMetadataPanel(amp.id))
    }
  }

  return (
    <MyLayerZone
      bbox={amp.bbox}
      displayedName={displayedName}
      hasMetadata={!!amp.name}
      hideLayer={() => dispatch(hideAmpLayer(amp.id))}
      layerType={MonitorEnvLayers.AMP}
      layerZoneIsShowed={isDisplayed}
      metadataIsShown={metadataIsShown}
      name={amp.name}
      removeZone={handleRemoveZone}
      showLayer={() => dispatch(showAmpLayer(amp.id))}
      toggleZoneMetadata={toggleRegulatoryZoneMetadata}
      type={amp.type}
    />
  )
}
