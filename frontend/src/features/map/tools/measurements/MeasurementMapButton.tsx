import { useClickOutside } from '@hooks/useClickOutside'
import { Icon, IconButton } from '@mtes-mct/monitor-ui'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { CustomCircleRange } from './CustomCircleRange'
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
  const displayMeasurement = useAppSelector(state => state.global.displayMeasurement)
  const healthcheckTextWarning = useAppSelector(state => state.global.healthcheckTextWarning)
  const isMapToolVisible = useAppSelector(state => state.global.isMapToolVisible)

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
    dispatch(globalActions.hideSideButtons())
    dispatch(setMeasurementTypeToAdd(nextMeasurementTypeToAdd))
    dispatch(globalActions.setIsMapToolVisible(MapToolType.MEASUREMENT))
    dispatch(closeAllOverlays())
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

  const openOrCloseMeasurementMenu = useCallback(() => {
    if (measurementTypeToAdd) {
      dispatch(setMeasurementTypeToAdd(undefined))
      dispatch(globalActions.setIsMapToolVisible(undefined))
    } else {
      dispatch(globalActions.hideSideButtons())
      dispatch(globalActions.setIsMapToolVisible(MapToolType.MEASUREMENT_MENU))
    }
    dispatch(reduceReportingFormOnMap())
  }, [dispatch, measurementTypeToAdd])

  return (
    <>
      <MapToolButton
        dataCy="measurement"
        icon={measurementIcon}
        isHidden={!displayMeasurement}
        isOpen={isOpen || !!measurementTypeToAdd}
        onClick={openOrCloseMeasurementMenu}
        title="Mesurer une distance"
      />

      <MeasurementOptions ref={wrapperRef} $healthcheckTextWarning={!!healthcheckTextWarning} $isOpen={isOpen}>
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
      <CustomCircleRange />
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
  margin-right: ${p => (p.$isOpen ? '36px' : '-200px')};
  opacity: ${p => (p.$isOpen ? '1' : '0')};
  position: absolute;
  right: 10px;
  transition: all 0.5s;
  width: 175px;
`
