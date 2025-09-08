import { DrawModalInMenu } from '@components/DrawModalInMenu'
import { recentActivityActions, RecentActivityFiltersEnum } from '@features/RecentActivity/slice'
import { resetDrawingZone } from '@features/RecentActivity/useCases/resetDrawingZone'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { InteractionType } from 'domain/entities/map/constants'

export function DrawZone({ className }: { className?: string }) {
  const dispatch = useAppDispatch()
  const drawedGeometry = useAppSelector(state => state.recentActivity.drawedGeometry)
  const interactionType = useAppSelector(state => state.recentActivity.interactionType)
  const isGeometryValid = useAppSelector(state => state.recentActivity.isGeometryValid)
  const initialGeometry = useAppSelector(state => state.recentActivity.initialGeometry)
  const geometryFilter = useAppSelector(state => state.recentActivity.filters.geometry)

  const handleSelectInteraction = (nextInteraction: InteractionType) => () => {
    dispatch(resetDrawingZone())
    dispatch(recentActivityActions.setInteractionType(nextInteraction))
  }

  const handleValidate = () => {
    if (drawedGeometry) {
      dispatch(recentActivityActions.updateFilters({ key: RecentActivityFiltersEnum.GEOMETRY, value: drawedGeometry }))
    }
    dispatch(recentActivityActions.setInitialGeometry(undefined))
    dispatch(recentActivityActions.setIsDrawing(false))
  }

  const reset = () => {
    if (!initialGeometry) {
      dispatch(resetDrawingZone())

      return
    }
    dispatch(recentActivityActions.setGeometry(initialGeometry))
  }

  const cancel = () => {
    if (drawedGeometry?.coordinates.length === 0) {
      dispatch(recentActivityActions.setGeometry(geometryFilter))
      dispatch(recentActivityActions.setIsDrawing(false))

      return
    }
    dispatch(recentActivityActions.setInteractionType(InteractionType.POLYGON))
    dispatch(recentActivityActions.setIsDrawing(false))
  }

  return (
    <DrawModalInMenu
      className={className}
      geometry={drawedGeometry}
      handleSelectInteraction={handleSelectInteraction}
      handleValidate={handleValidate}
      interactionType={interactionType}
      isGeometryValid={isGeometryValid}
      onCancel={cancel}
      reset={reset}
      validateText="Valider la zone à filtrer"
    />
  )
}
