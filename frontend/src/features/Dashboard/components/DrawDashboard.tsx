import { DrawModalInMenu } from '@components/DrawModalInMenu'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { InteractionType } from 'domain/entities/map/constants'
import { restorePreviousDisplayedItems } from 'domain/shared_slices/Global'

import { dashboardActions } from '../slice'
import { createDashboard } from '../useCases/createDashboard'
import { resetDrawing } from '../useCases/resetDrawing'

export function DrawDashboard({ className, onCancel }: { className?: string; onCancel: () => void }) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.dashboard.geometry)
  const interactionType = useAppSelector(state => state.dashboard.interactionType)
  const isGeometryValid = useAppSelector(state => state.dashboard.isGeometryValid)
  const initialGeometry = useAppSelector(state => state.dashboard.initialGeometry)

  const handleSelectInteraction = (nextInteraction: InteractionType) => () => {
    dispatch(resetDrawing())
    dispatch(dashboardActions.setInteractionType(nextInteraction))
  }

  const handleValidate = () => {
    if (geometry) {
      dispatch(createDashboard(geometry))
    }
    dispatch(resetDrawing())
    dispatch(dashboardActions.setIsDrawing(false))
    dispatch(restorePreviousDisplayedItems())
  }

  const reset = () => {
    if (!initialGeometry) {
      dispatch(resetDrawing())

      return
    }
    dispatch(dashboardActions.setGeometry(initialGeometry))
  }

  return (
    <DrawModalInMenu
      className={className}
      geometry={geometry}
      handleSelectInteraction={handleSelectInteraction}
      handleValidate={handleValidate}
      interactionType={interactionType}
      isGeometryValid={isGeometryValid}
      onCancel={onCancel}
      reset={reset}
      validateText="Créer le tableau"
    />
  )
}
