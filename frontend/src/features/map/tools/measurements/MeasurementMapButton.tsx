import { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { MapToolType, MeasurementType } from '../../../../domain/entities/map/constants'
import { setMapToolOpened } from '../../../../domain/shared_slices/Global'
import { setMeasurementTypeToAdd } from '../../../../domain/shared_slices/Measurement'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useClickOutsideWhenOpenedAndExecute } from '../../../../hooks/useClickOutsideWhenOpenedAndExecute'
import { useEscapeFromKeyboardAndExecute } from '../../../../hooks/useEscapeFromKeyboardAndExecute'
import { ReactComponent as MultiLineSVG } from '../../../../uiMonitor/icons/Measure_broken_line.svg'
import { ReactComponent as CircleRangeSVG } from '../../../../uiMonitor/icons/Measure_circle.svg'
import { ReactComponent as MeasurementSVG } from '../../../../uiMonitor/icons/Measure_line.svg'
import { MapComponentStyle } from '../../../commonStyles/MapComponent.style'
import { MapToolButton } from '../MapToolButton'
import { CustomCircleRange } from './CustomCircleRange'

export function MeasurementMapButton() {
  const dispatch = useAppDispatch()
  const { measurementTypeToAdd } = useAppSelector(state => state.measurement)
  const { displayMeasurement, healthcheckTextWarning, mapToolOpened, rightMenuIsOpen } = useAppSelector(
    state => state.global
  )

  const isRightMenuShrinked = !rightMenuIsOpen
  const isOpen = useMemo(() => mapToolOpened === MapToolType.MEASUREMENT_MENU, [mapToolOpened])
  const isMeasurementToolOpen = useMemo(() => mapToolOpened === MapToolType.MEASUREMENT, [mapToolOpened])
  const wrapperRef = useRef(null)

  useClickOutsideWhenOpenedAndExecute(wrapperRef, isOpen, () => {
    dispatch(setMapToolOpened(undefined))
  })

  useEscapeFromKeyboardAndExecute(() => {
    dispatch(setMeasurementTypeToAdd(undefined))
    dispatch(setMapToolOpened(undefined))
  })

  useEffect(() => {
    if (!isOpen && !isMeasurementToolOpen && !!measurementTypeToAdd) {
      dispatch(setMeasurementTypeToAdd(undefined))
    }
  }, [dispatch, isOpen, isMeasurementToolOpen, measurementTypeToAdd])

  const makeMeasurement = nextMeasurementTypeToAdd => {
    dispatch(setMeasurementTypeToAdd(nextMeasurementTypeToAdd))
    dispatch(setMapToolOpened(MapToolType.MEASUREMENT))
  }

  const measurementIcon = useMemo(() => {
    switch (measurementTypeToAdd) {
      case MeasurementType.MULTILINE:
        return <MultiLineIcon />
      case MeasurementType.CIRCLE_RANGE:
        return <CircleRangeIcon />
      default:
        return <MeasurementIcon $isRightMenuShrinked={isRightMenuShrinked} />
    }
  }, [measurementTypeToAdd, isRightMenuShrinked])

  const openOrCloseMeasurementMenu = useCallback(() => {
    if (measurementTypeToAdd) {
      dispatch(setMeasurementTypeToAdd(undefined))
      dispatch(setMapToolOpened(undefined))
    } else {
      dispatch(setMapToolOpened(MapToolType.MEASUREMENT_MENU))
    }
  }, [dispatch, measurementTypeToAdd])

  return (
    <Wrapper ref={wrapperRef}>
      <MeasurementButton
        dataCy="measurement"
        isHidden={!displayMeasurement}
        isOpen={isOpen || !!measurementTypeToAdd}
        onClick={openOrCloseMeasurementMenu}
        style={{ top: 249 }}
        title="Mesurer une distance"
      >
        {measurementIcon}
      </MeasurementButton>
      <MeasurementOptions healthcheckTextWarning={!!healthcheckTextWarning} isOpen={isOpen}>
        <MeasurementItem
          className=".map-menu"
          data-cy="measurement-multiline"
          onClick={() => makeMeasurement(MeasurementType.MULTILINE)}
          title={"Mesure d'une distance avec lignes brisées"}
        >
          <MultiLineIcon />
        </MeasurementItem>
        <MeasurementItem
          className=".map-menu"
          data-cy="measurement-circle-range"
          onClick={() => makeMeasurement(MeasurementType.CIRCLE_RANGE)}
          title={"Rayon d'action"}
        >
          <CircleRangeIcon />
        </MeasurementItem>
      </MeasurementOptions>
      <CustomCircleRange />
    </Wrapper>
  )
}

const MeasurementItem = styled.div`
  background: ${p => p.theme.color.blueGray[100]};
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  float: right;
  height: 40px;
  margin-left: 5px;
  padding: 0;
  padding-top: 8px;
  position: relative;
  right: 0;
  width: 40px;
  z-index: 99;
`

const MultiLineIcon = styled(MultiLineSVG)`
  height: 25px;
  width: 25px;

  path {
    fill: ${p => p.theme.color.gainsboro};
  }
`

const CircleRangeIcon = styled(CircleRangeSVG)`
  height: 25px;
  width: 25px;

  path {
    fill: ${p => p.theme.color.gainsboro};
  }
`

const Wrapper = styled.div`
  transition: all 0.2s;
  z-index: 1000;
`

const MeasurementOptions = styled(MapComponentStyle)<{
  healthcheckTextWarning: boolean
  isHidden?: boolean
  isOpen: boolean
}>`
  border-radius: 2px;
  display: inline-block;
  margin-right: ${p => (p.isOpen ? '45px' : '-200px')};
  opacity: ${p => (p.isOpen ? '1' : '0')};
  position: absolute;
  right: 10px;
  top: 249px;
  transition: all 0.5s;
  width: 175px;
  z-index: 999;
`

const MeasurementButton = styled(MapToolButton)``

const MeasurementIcon = styled(MeasurementSVG)<{
  $isRightMenuShrinked: boolean
}>`
  height: 25px;
  opacity: ${p => (p.$isRightMenuShrinked ? '0' : '1')};
  transition: all 0.2s;
  width: 25px;

  path:first-of-type {
    fill: ${p => p.theme.color.gainsboro};
  }
`
