import { DrawModalInMenu } from '@components/DrawModalInMenu'
import { recentActivityActions } from '@features/RecentActivity/slice'
import { resetDrawingZone } from '@features/RecentActivity/useCases/resetDrawingZone'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'

import type { InteractionType } from 'domain/entities/map/constants'

export function DrawZone({ className }: { className?: string }) {
  const dispatch = useAppDispatch()
  const drawedGeometry = useAppSelector(state => state.recentActivity.drawedGeometry)
  const interactionType = useAppSelector(state => state.recentActivity.interactionType)
  const isGeometryValid = useAppSelector(state => state.recentActivity.isGeometryValid)
  const initialGeometry = useAppSelector(state => state.recentActivity.initialGeometry)

  const handleSelectInteraction = (nextInteraction: InteractionType) => () => {
    dispatch(resetDrawingZone())
    dispatch(recentActivityActions.setInteractionType(nextInteraction))
  }

  const handleValidate = () => {
    if (drawedGeometry) {
      dispatch(recentActivityActions.updateFilters({ key: 'geometry', value: drawedGeometry }))
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
    dispatch(resetDrawingZone())
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
