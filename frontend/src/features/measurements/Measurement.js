import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'
import { MeasurementTypes } from '../../domain/entities/map'
import {
  resetCircleMeasurementInDrawing,
  setCircleMeasurementToAdd,
  setMeasurementTypeToAdd
} from '../../domain/shared_slices/Measurement'
import { useClickOutsideComponent } from '../../hooks/useClickOutside'
import { useEscapeFromKeyboard } from '../../hooks/useEscapeFromKeyboard'
import { ReactComponent as MeasurementSVG } from '../../uiMonitor/icons/Mesure.svg'
import { ReactComponent as MultiLineSVG } from '../../uiMonitor/icons/Mesure_ligne_brisee.svg'
import { ReactComponent as CircleRangeSVG } from '../../uiMonitor/icons/Mesure_rayon_action.svg'
import { MapComponentStyle } from '../commonStyles/MapComponent.style'
import CustomCircleRange from './CustomCircleRange'

const MEASUREMENT_POSITION_FROM_LEFT = 440

function MeasurementIconSelector({ measurementType, small }) {
  switch (measurementType) {
    case MeasurementTypes.MULTILINE:
      return <MultiLineIcon className="rs-icon" style={small && { height: '20px', width: '20px' }} />
    case MeasurementTypes.CIRCLE_RANGE:
      return <CircleRangeIcon className="rs-icon" />
    default:
      return <MeasurementIcon className="rs-icon" />
  }
}

function Measurement() {
  const dispatch = useDispatch()
  const { measurementTypeToAdd } = useSelector(state => state.measurement)

  const [measurementIsOpen, setMeasurementIsOpen] = useState(false)
  const [circleCoordinatesToAdd, setCircleCoordinatesToAdd] = useState([])
  const [circleRadiusToAdd, setCircleRadiusToAdd] = useState('')
  const wrapperRef = useRef(null)
  const clickedOutsideComponent = useClickOutsideComponent(wrapperRef)
  const escapeFromKeyboard = useEscapeFromKeyboard()

  useEffect(() => {
    setCircleCoordinatesToAdd([])
    setCircleRadiusToAdd('')
  }, [measurementIsOpen])

  useEffect(() => {
    if (clickedOutsideComponent) {
      setMeasurementIsOpen(false)
    }
  }, [clickedOutsideComponent])

  useEffect(() => {
    if (escapeFromKeyboard) {
      dispatch(setMeasurementTypeToAdd(null))
      setMeasurementIsOpen(false)
    }
  }, [escapeFromKeyboard])

  const makeMeasurement = measurementType => {
    dispatch(setMeasurementTypeToAdd(measurementType))
    setMeasurementIsOpen(false)
  }

  function openOrCloseMeasurement() {
    if (measurementTypeToAdd) {
      dispatch(setMeasurementTypeToAdd(null))
      setMeasurementIsOpen(false)
    } else {
      setMeasurementIsOpen(!measurementIsOpen)
    }
  }

  function addCustomCircleRange() {
    dispatch(
      setCircleMeasurementToAdd({
        circleCoordinatesToAdd,
        circleRadiusToAdd
      })
    )
    setCircleCoordinatesToAdd([])
    setCircleRadiusToAdd('')
    dispatch(setMeasurementTypeToAdd(null))
    setMeasurementIsOpen(false)
  }

  function cancelAddCircleRange() {
    dispatch(setMeasurementTypeToAdd(null))
    dispatch(resetCircleMeasurementInDrawing())
    setMeasurementIsOpen(false)
  }

  return (
    <MeasurementWrapper>
      <IconButton
        appearance="primary"
        data-cy="measurement"
        icon={<MeasurementIconSelector measurementType={measurementTypeToAdd} small />}
        onClick={openOrCloseMeasurement}
        size="sm"
        title="prendre une mesure"
      />
      <MeasurementOptions measurementBoxIsOpen={measurementIsOpen}>
        <MeasurementItem
          data-cy="measurement-multiline"
          onClick={() => makeMeasurement(MeasurementTypes.MULTILINE)}
          title={"Mesure d'une distance avec lignes brisées"}
        >
          <MultiLineIcon />
        </MeasurementItem>
        <MeasurementItem
          data-cy="measurement-circle-range"
          onClick={() => makeMeasurement(MeasurementTypes.CIRCLE_RANGE)}
          title={"Rayon d'action"}
        >
          <CircleRangeIcon />
        </MeasurementItem>
      </MeasurementOptions>
      <CustomCircleRange
        addCustomCircleRange={addCustomCircleRange}
        cancelAddCircleRange={cancelAddCircleRange}
        circleCoordinatesToAdd={circleCoordinatesToAdd}
        circleRadiusToAdd={circleRadiusToAdd}
        measurementIsOpen={measurementIsOpen}
        measurementTypeToAdd={measurementTypeToAdd}
        positionFromTop={MEASUREMENT_POSITION_FROM_LEFT}
        setCircleCoordinatesToAdd={setCircleCoordinatesToAdd}
        setCircleRadiusToAdd={setCircleRadiusToAdd}
      />
    </MeasurementWrapper>
  )
}

const MeasurementWrapper = styled.div`
  position: absolute;
  bottom: 11px;
  left: ${MEASUREMENT_POSITION_FROM_LEFT}px;
  width: 20px;
`

const MeasurementItem = styled.div`
  display: inline-block;
  color: ${COLORS.blue};
  background: ${COLORS.shadowBlue};
  padding: 0;
  z-index: 99;
  cursor: pointer;
  position: relative;
  :not(:first-child) {
    margin-left: 5px;
  }
`

const MultiLineIcon = styled(MultiLineSVG)``

const CircleRangeIcon = styled(CircleRangeSVG)``

const MeasurementIcon = styled(MeasurementSVG)`
  width: 20px;
  height: 20px;
`

const MeasurementOptions = styled(MapComponentStyle)`
  width: 175px;
  margin-bottom: ${props => (props.measurementBoxIsOpen ? '8px' : '-200px')};
  opacity: ${props => (props.measurementBoxIsOpen ? '1' : '0')};
  position: absolute;
  bottom: 20px;
  left: 0;
  text-align: left;
  border-radius: 2px;
  display: inline-block;
  transition: all 0.5s;
`

export default Measurement
