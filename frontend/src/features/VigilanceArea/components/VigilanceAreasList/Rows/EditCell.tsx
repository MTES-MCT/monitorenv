import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Icon, IconButton, OPENLAYERS_PROJECTION, Size } from '@mtes-mct/monitor-ui'
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
      aria-label="Editer"
      data-cy={`edit-mission-${id}`}
      Icon={Icon.Edit}
      onClick={editVigilanceArea}
      size={Size.SMALL}
    />
  )
}
const StyledIconButton = styled(IconButton)`
  display: inherit;
  margin: auto;
`
