import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { dashboardActions } from '@features/Dashboard/slice'
import { EditInterestPoint } from '@features/InterestPoint/components/EditInterestPoint'
import {
  cancelEditingInterestPoint,
  endDrawingInterestPoint,
  removeUnsavedInterestPoint,
  startDrawingInterestPoint
} from '@features/InterestPoint/slice'
import { reduceReportingFormOnMap } from '@features/Reportings/useCases/reduceReportingFormOnMap'
import { Icon, Size } from '@mtes-mct/monitor-ui'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'
import { useCallback, useEffect, useMemo } from 'react'

import { MapToolType } from '../../../domain/entities/map/constants'
import { globalActions } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useEscapeKey } from '../../../hooks/useEscapeKey'

export function InterestPointMapButton() {
  const dispatch = useAppDispatch()
  const isMapToolVisible = useAppSelector(state => state.global.visibility.isMapToolVisible)

  const isOpen = useMemo(() => isMapToolVisible === MapToolType.INTEREST_POINT, [isMapToolVisible])

  useEffect(() => {
    if (isOpen) {
      dispatch(startDrawingInterestPoint())
    } else {
      dispatch(endDrawingInterestPoint())
      dispatch(removeUnsavedInterestPoint())
    }
  }, [dispatch, isOpen])

  const close = useCallback(() => {
    dispatch(globalActions.setIsMapToolVisible(undefined))
  }, [dispatch])

  const cancel = useCallback(() => {
    dispatch(cancelEditingInterestPoint())
    close()
  }, [dispatch, close])

  useEscapeKey({ onEscape: cancel })

  const toggleInterestPointMenu = () => {
    if (!isOpen) {
      dispatch(globalActions.hideAllDialogs())
      dispatch(reduceReportingFormOnMap())
      dispatch(globalActions.setIsMapToolVisible(MapToolType.INTEREST_POINT))
      dispatch(closeAllOverlays())
    } else {
      close()
    }
    dispatch(dashboardActions.setMapFocus(false))
  }

  return (
    <>
      {isOpen && <EditInterestPoint cancel={cancel} close={close} />}

      <MenuWithCloseButton.ButtonOnMap
        className={isOpen ? '_active' : undefined}
        data-cy="interest-point"
        Icon={Icon.Landmark}
        onClick={toggleInterestPointMenu}
        size={Size.LARGE}
        title="Créer un point d'intérêt"
      />
    </>
  )
}
