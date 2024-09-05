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
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { MapToolType } from '../../../domain/entities/map/constants'
import { globalActions, setDisplayedItems } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useEscapeKey } from '../../../hooks/useEscapeKey'
import { ButtonWrapper } from '../../MainWindow/components/RightMenu/ButtonWrapper'

export function InterestPointMapButton() {
  const dispatch = useAppDispatch()
  const isMapToolVisible = useAppSelector(state => state.global.isMapToolVisible)

  const isOpen = useMemo(() => isMapToolVisible === MapToolType.INTEREST_POINT, [isMapToolVisible])

  const wrapperRef = useRef(null)

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
      dispatch(
        setDisplayedItems({
          isControlUnitDialogVisible: false,
          isControlUnitListDialogVisible: false,
          isSearchMissionsVisible: false,
          isSearchReportingsVisible: false,
          isSearchSemaphoreVisible: false
        })
      )
      dispatch(reduceReportingFormOnMap())
      dispatch(globalActions.setIsMapToolVisible(MapToolType.INTEREST_POINT))
      dispatch(closeAllOverlays())
    } else {
      close()
    }
  }, [close, dispatch, isOpen])

  return (
    <ButtonWrapper ref={wrapperRef} topPosition={346}>
      {isOpen && <EditInterestPoint cancel={cancel} close={close} />}

      <MenuWithCloseButton.ButtonOnMap
        className={isOpen ? '_active' : undefined}
        data-cy="interest-point"
        Icon={Icon.Landmark}
        onClick={toggleInterestPointMenu}
        size={Size.LARGE}
        title="Créer un point d'intérêt"
      />
    </ButtonWrapper>
  )
}
