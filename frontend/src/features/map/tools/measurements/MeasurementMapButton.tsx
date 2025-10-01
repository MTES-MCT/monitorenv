import { dashboardActions } from '@features/Dashboard/slice'
import { CustomCircleRange } from '@features/map/tools/measurements/CustomCircleRange'
import { useClickOutside } from '@hooks/useClickOutside'
import { useMountTransition } from '@hooks/useMountTransition'
import { Icon, IconButton } from '@mtes-mct/monitor-ui'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { MapToolType, MeasurementType } from '../../../../domain/entities/map/constants'
import { globalActions } from '../../../../domain/shared_slices/Global'
import { setMeasurementTypeToAdd } from '../../../../domain/shared_slices/Measurement'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useEscapeKey } from '../../../../hooks/useEscapeKey'
import { MapComponentStyle } from '../../../commonStyles/MapComponent.style'
import { reduceReportingFormOnMap } from '../../../Reportings/useCases/reduceReportingFormOnMap'
import { MapToolButton } from '../MapToolButton'

export function MeasurementMapButton() {
  const dispatch = useAppDispatch()
  const measurementTypeToAdd = useAppSelector(state => state.measurement.measurementTypeToAdd)
  const displayMeasurement = useAppSelector(state => state.global.menus.displayMeasurement)
  const healthcheckTextWarning = useAppSelector(state => state.global.healthcheckTextWarning)
  const isMapToolVisible = useAppSelector(state => state.global.visibility.isMapToolVisible)

  const isOpen = useMemo(() => isMapToolVisible === MapToolType.MEASUREMENT_MENU, [isMapToolVisible])
  const isMeasurementToolOpen = useMemo(() => isMapToolVisible === MapToolType.MEASUREMENT, [isMapToolVisible])
  const wrapperRef = useRef(null)
  useClickOutside(wrapperRef, () => {
    if (isOpen) {
      dispatch(globalActions.setIsMapToolVisible(undefined))
    }
  })

  useEscapeKey({
    onEscape: () => {
      dispatch(setMeasurementTypeToAdd(undefined))
      dispatch(globalActions.setIsMapToolVisible(undefined))
    }
  })

  useEffect(() => {
    if (!isOpen && !isMeasurementToolOpen && !!measurementTypeToAdd) {
      dispatch(setMeasurementTypeToAdd(undefined))
    }
  }, [dispatch, isOpen, isMeasurementToolOpen, measurementTypeToAdd])

  const makeMeasurement = nextMeasurementTypeToAdd => {
    dispatch(setMeasurementTypeToAdd(nextMeasurementTypeToAdd))
    dispatch(globalActions.setIsMapToolVisible(MapToolType.MEASUREMENT))
    dispatch(closeAllOverlays())
    dispatch(dashboardActions.setMapFocus(false))
  }

  const measurementIcon = useMemo(() => {
    switch (measurementTypeToAdd) {
      case MeasurementType.MULTILINE:
        return Icon.MeasureBrokenLine
      case MeasurementType.CIRCLE_RANGE:
        return Icon.MeasureCircle
      default:
        return Icon.MeasureLine
    }
  }, [measurementTypeToAdd])

  const hasTransition = useMountTransition(isOpen, 500)

  const openOrCloseMeasurementMenu = useCallback(() => {
    if (measurementTypeToAdd) {
      dispatch(setMeasurementTypeToAdd(undefined))
      dispatch(globalActions.setIsMapToolVisible(undefined))
    } else {
      dispatch(globalActions.hideAllDialogs())
      dispatch(globalActions.setIsMapToolVisible(MapToolType.MEASUREMENT_MENU))
    }
    dispatch(reduceReportingFormOnMap())
  }, [dispatch, measurementTypeToAdd])

  return (
    <>
      <Wrapper>
        <MapToolButton
          dataCy="measurement"
          icon={measurementIcon}
          isHidden={!displayMeasurement}
          isOpen={isOpen || !!measurementTypeToAdd}
          onClick={openOrCloseMeasurementMenu}
          title="Mesurer une distance"
        />

        {(isOpen || hasTransition) && (
          <MeasurementOptions
            ref={wrapperRef}
            $healthcheckTextWarning={!!healthcheckTextWarning}
            $isOpen={isOpen && hasTransition}
          >
            <MeasurementItem
              className="_active"
              data-cy="measurement-multiline"
              Icon={() => Icon.MeasureBrokenLine({ size: 28 })}
              onClick={() => makeMeasurement(MeasurementType.MULTILINE)}
              title="Mesure d'une distance avec lignes brisées"
            />
            <MeasurementItem
              className="_active"
              data-cy="measurement-circle-range"
              Icon={() => Icon.MeasureCircle({ size: 28 })}
              onClick={() => makeMeasurement(MeasurementType.CIRCLE_RANGE)}
              title="Rayon d'action"
            />
          </MeasurementOptions>
        )}
        <CustomCircleRange />
      </Wrapper>
    </>
  )
}

const MeasurementItem = styled(IconButton)`
  background: ${p => p.theme.color.blueGray};
  cursor: pointer;
  float: right;
  margin-left: 5px;
  position: relative;
`

const MeasurementOptions = styled(MapComponentStyle)<{
  $isOpen: boolean
}>`
  border-radius: 2px;
  display: inline-block;
  transform: ${p => (p.$isOpen ? 'translateX(-35px)' : 'translateX(100%)')};
  opacity: ${p => (p.$isOpen ? '1' : '0')};
  position: absolute;
  right: 10px;
  transition: all 0.5s;
  width: 175px;
`

const Wrapper = styled.div`
  display: flex;
`
