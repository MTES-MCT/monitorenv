import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { setFitToExtent } from 'domain/shared_slices/Map'
import styled from 'styled-components'

import type { GeoJSON } from 'domain/types/GeoJSON'

export function EditCell({ geom, id }: { geom?: GeoJSON.MultiPolygon; id: number }) {
  const dispatch = useAppDispatch()
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)

  const editVigilanceArea = () => {
    if (editingVigilanceAreaId && editingVigilanceAreaId !== id) {
      dispatch(vigilanceAreaActions.openCancelModal(id))

      return
    }
    dispatch(vigilanceAreaActions.setEditingVigilanceAreaId(id))
    dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(id))
    if (!geom) {
      return
    }
    const feature = getFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }
  }

  return (
    <StyledIconButton
      accent={Accent.TERTIARY}
      data-cy={`edit-mission-${id}`}
      Icon={Icon.Edit}
      onClick={editVigilanceArea}
      title="Editer"
    />
  )
}
const StyledIconButton = styled(IconButton)`
  padding: 0px;
`
