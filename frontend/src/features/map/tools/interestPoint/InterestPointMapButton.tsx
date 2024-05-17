import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { Icon, Size } from '@mtes-mct/monitor-ui'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { EditInterestPoint } from './EditInterestPoint'
import { MapToolType } from '../../../../domain/entities/map/constants'
import { globalActions, setDisplayedItems } from '../../../../domain/shared_slices/Global'
import {
  deleteInterestPointBeingDrawed,
  drawInterestPoint,
  endInterestPointDraw
} from '../../../../domain/shared_slices/InterestPoint'
import { reduceReportingFormOnMap } from '../../../../domain/use_cases/reporting/reduceReportingFormOnMap'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useEscapeFromKeyboardAndExecute } from '../../../../hooks/useEscapeFromKeyboardAndExecute'
import { ButtonWrapper } from '../../../MainWindow/components/RightMenu/ButtonWrapper'

export function InterestPointMapButton() {
  const dispatch = useAppDispatch()
  const isMapToolVisible = useAppSelector(state => state.global.isMapToolVisible)
  const displayInterestPointLayer = useAppSelector(state => state.global.displayInterestPointLayer)

  const isOpen = useMemo(() => isMapToolVisible === MapToolType.INTEREST_POINT, [isMapToolVisible])
  const wrapperRef = useRef(null)

  const close = useCallback(() => {
    dispatch(globalActions.setIsMapToolVisible(undefined))
  }, [dispatch])

  useEscapeFromKeyboardAndExecute(close)

  useEffect(() => {
    if (!isOpen) {
      dispatch(endInterestPointDraw())
      dispatch(deleteInterestPointBeingDrawed())
    }
  }, [dispatch, isOpen])

  const toggleInterestPointMenu = useCallback(() => {
    if (!isOpen) {
      if (displayInterestPointLayer) {
        dispatch(drawInterestPoint())
      }
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
    } else {
      close()
    }
  }, [close, dispatch, isOpen, displayInterestPointLayer])

  return (
    <ButtonWrapper ref={wrapperRef} topPosition={346}>
      {isOpen && <EditInterestPoint close={close} />}

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
