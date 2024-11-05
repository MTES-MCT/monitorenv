import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { GeoJSON as GeoJsonOpenLayer } from 'ol/format'
import styled from 'styled-components'

import type { GeoJSON } from 'domain/types/GeoJSON'

export function EditCell({ geom, id }: { geom?: GeoJSON.MultiPolygon; id: number }) {
  const dispatch = useAppDispatch()

  const editVigilanceArea = () => {
    dispatch(vigilanceAreaActions.setEditingVigilanceAreaId(id))
    dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(id))

    if (!geom) {
      return
    }
    const feature = new GeoJsonOpenLayer({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }
  }

  return (
    <StyledIconButton
      accent={Accent.TERTIARY}
      aria-label="Editer"
      data-cy={`edit-mission-${id}`}
      Icon={Icon.Edit}
      onClick={editVigilanceArea}
    />
  )
}
const StyledIconButton = styled(IconButton)`
  padding: 0px;
`