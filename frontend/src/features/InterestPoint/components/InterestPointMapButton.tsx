import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { EditInterestPoint } from '@features/InterestPoint/components/EditInterestPoint'
import {
  cancelEditingInterestPoint,
  endDrawingInterestPoint,
  removeUnsavedInterestPoint,
  startDrawingInterestPoint
} from '@features/InterestPoint/slice'
import { Icon, Size } from '@mtes-mct/monitor-ui'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'
import { reduceReportingFormOnMap } from 'domain/use_cases/reporting/reduceReportingFormOnMap'
import { useCallback, useEffect, useMemo } from 'react'

import { MapToolType } from '../../../domain/entities/map/constants'
import { globalActions } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useEscapeKey } from '../../../hooks/useEscapeKey'

export function InterestPointMapButton() {
  const dispatch = useAppDispatch()
  const isMapToolVisible = useAppSelector(state => state.global.isMapToolVisible)

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

  useEscapeKey(cancel)

  const toggleInterestPointMenu = useCallback(() => {
    if (!isOpen) {
      dispatch(globalActions.hideSideButtons())
      dispatch(reduceReportingFormOnMap())
      dispatch(globalActions.setIsMapToolVisible(MapToolType.INTEREST_POINT))
      dispatch(closeAllOverlays())
    } else {
      close()
    }
  }, [close, dispatch, isOpen])

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
