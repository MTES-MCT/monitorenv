import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { setFitToExtent } from 'domain/shared_slices/Map'

export function LocalizeCell({ geom }: { geom: any }) {
  const dispatch = useAppDispatch()

  const handleZoom = e => {
    e.stopPropagation()
    const feature = getFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }
  }

  return (
    <IconButton
      accent={Accent.TERTIARY}
      disabled={!geom}
      Icon={Icon.FocusZones}
      onClick={handleZoom}
      title={geom ? 'Centrer sur la carte' : 'Pas de zone renseignée'}
    />
  )
}
