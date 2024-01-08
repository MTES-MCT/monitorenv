import { Icon, THEME } from '@mtes-mct/monitor-ui'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { CustomCircleRange } from './CustomCircleRange'
import { MapToolType, MeasurementType } from '../../../../domain/entities/map/constants'
import { globalActions } from '../../../../domain/shared_slices/Global'
import { setMeasurementTypeToAdd } from '../../../../domain/shared_slices/Measurement'
import { reduceReportingFormOnMap } from '../../../../domain/use_cases/reporting/reduceReportingFormOnMap'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useClickOutsideWhenOpenedAndExecute } from '../../../../hooks/useClickOutsideWhenOpenedAndExecute'
import { useEscapeFromKeyboardAndExecute } from '../../../../hooks/useEscapeFromKeyboardAndExecute'
import { MapComponentStyle } from '../../../commonStyles/MapComponent.style'
import { ButtonWrapper } from '../../../MainWindow/components/RightMenu/ButtonWrapper'
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

  useClickOutsideWhenOpenedAndExecute(wrapperRef, isOpen, () => {
    dispatch(globalActions.setIsMapToolVisible(undefined))
  })

  useEscapeFromKeyboardAndExecute(() => {
    dispatch(setMeasurementTypeToAdd(undefined))
    dispatch(globalActions.setIsMapToolVisible(undefined))
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
    <ButtonWrapper ref={wrapperRef} topPosition={298}>
      <MapToolButton
        dataCy="measurement"
        icon={measurementIcon}
        isHidden={!displayMeasurement}
        isOpen={isOpen || !!measurementTypeToAdd}
        onClick={openOrCloseMeasurementMenu}
        style={{ top: 249 }}
        title="Mesurer une distance"
      />

      <MeasurementOptions healthcheckTextWarning={!!healthcheckTextWarning} isOpen={isOpen}>
        <MeasurementItem
          data-cy="measurement-multiline"
          onClick={() => makeMeasurement(MeasurementType.MULTILINE)}
          title={"Mesure d'une distance avec lignes brisées"}
        >
          <Icon.MeasureBrokenLine color={THEME.color.gainsboro} size={25} />
        </MeasurementItem>
        <MeasurementItem
          data-cy="measurement-circle-range"
          onClick={() => makeMeasurement(MeasurementType.CIRCLE_RANGE)}
          title={"Rayon d'action"}
        >
          <Icon.MeasureCircle color={THEME.color.gainsboro} size={25} />
        </MeasurementItem>
      </MeasurementOptions>
      <CustomCircleRange />
    </ButtonWrapper>
  )
}

const MeasurementItem = styled.div`
  background: ${p => p.theme.color.blueGray};
  border-radius: 2px;
  cursor: pointer;
  float: right;
  height: 40px;
  margin-left: 5px;
  position: relative;
  width: 40px;
  padding: 8px;
`

const MeasurementOptions = styled(MapComponentStyle)<{
  healthcheckTextWarning: boolean
  isHidden?: boolean
  isOpen: boolean
}>`
  border-radius: 2px;
  display: inline-block;
  margin-right: ${p => (p.isOpen ? '36px' : '-200px')};
  opacity: ${p => (p.isOpen ? '1' : '0')};
  position: absolute;
  right: 10px;
  top: 0;
  transition: all 0.5s;
  width: 175px;
`
