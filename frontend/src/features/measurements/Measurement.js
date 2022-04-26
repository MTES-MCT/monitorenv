import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { useClickOutsideComponent } from '../../hooks/useClickOutside'
import { useEscapeFromKeyboard } from '../../hooks/useEscapeFromKeyboard'

import { RightMenuButton } from "../commonComponents/RightMenuButton/RightMenuButton"
import {
  resetCircleMeasurementInDrawing,
  setCircleMeasurementToAdd,
  setMeasurementTypeToAdd
} from '../../domain/shared_slices/Measurement'
import { MeasurementTypes } from '../../domain/entities/map'
import CustomCircleRange from './CustomCircleRange'

import { MapComponentStyle } from '../commonStyles/MapComponent.style'

import { ReactComponent as MeasurementSVG } from '../icons/Mesure.svg'
import { ReactComponent as MultiLineSVG } from '../icons/Mesure_ligne_brisee.svg'
import { ReactComponent as CircleRangeSVG } from '../icons/Mesure_rayon_action.svg'
import { COLORS } from '../../constants/constants'

const MEASUREMENT_POSITION_FROM_TOP = 100

const MeasurementIconSelector = ({measurementType, rightMenuIsOpen}) => {
  switch (measurementType) {
    case MeasurementTypes.MULTILINE:
      return <MultiLineIcon/>
    case MeasurementTypes.CIRCLE_RANGE:
      return <CircleRangeIcon/>
    default:
      return <MeasurementIcon $rightMenuIsOpen={rightMenuIsOpen} />
  }
}

const Measurement = () => {
  const dispatch = useDispatch()
  const {  measurementTypeToAdd } = useSelector(state => state.measurement)
  const {  rightMenuIsOpen } = useSelector(state => state.global)

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

  

  function openOrCloseMeasurement () {
    if (measurementTypeToAdd) {
      dispatch(setMeasurementTypeToAdd(null))
      setMeasurementIsOpen(false)
    } else {
      setMeasurementIsOpen(!measurementIsOpen)
    }
  }

  function addCustomCircleRange () {
    dispatch(setCircleMeasurementToAdd({
      circleCoordinatesToAdd: circleCoordinatesToAdd,
      circleRadiusToAdd: circleRadiusToAdd
    }))
    setCircleCoordinatesToAdd([])
    setCircleRadiusToAdd('')
    dispatch(setMeasurementTypeToAdd(null))
    setMeasurementIsOpen(false)
  }

  function cancelAddCircleRange () {
    dispatch(setMeasurementTypeToAdd(null))
    dispatch(resetCircleMeasurementInDrawing())
    setMeasurementIsOpen(false)
  }

  return (
    <RightMenuButton
      top={MEASUREMENT_POSITION_FROM_TOP}
      data-cy={'measurement'}
      onClick={openOrCloseMeasurement}
      button={<MeasurementIconSelector measurementType={measurementTypeToAdd} rightMenuIsOpen={rightMenuIsOpen} />}
      >
      <MeasurementOptions
        measurementBoxIsOpen={measurementIsOpen}>
        <MeasurementItem
          data-cy={'measurement-multiline'}
          title={'Mesure d\'une distance avec lignes brisées'}
          onClick={() => makeMeasurement(MeasurementTypes.MULTILINE)}>
          <MultiLineIcon/>
        </MeasurementItem>
        <MeasurementItem
          data-cy={'measurement-circle-range'}
          title={'Rayon d\'action'}
          onClick={() => makeMeasurement(MeasurementTypes.CIRCLE_RANGE)}>
          <CircleRangeIcon/>
        </MeasurementItem>
      </MeasurementOptions>
      <CustomCircleRange
        positionFromTop={MEASUREMENT_POSITION_FROM_TOP}
        measurementIsOpen={measurementIsOpen}
        measurementTypeToAdd={measurementTypeToAdd}
        circleCoordinatesToAdd={circleCoordinatesToAdd}
        circleRadiusToAdd={circleRadiusToAdd}
        setCircleCoordinatesToAdd={setCircleCoordinatesToAdd}
        setCircleRadiusToAdd={setCircleRadiusToAdd}
        cancelAddCircleRange={cancelAddCircleRange}
        addCustomCircleRange={addCustomCircleRange}/>
    </RightMenuButton>
  )
}

const MeasurementItem = styled.div`
  display: inline-block;
  color: ${COLORS.blue};
  background: ${COLORS.shadowBlue};
  padding: 0;
  z-index: 99;
  right: 0;
  height: 40px;
  width: 40px;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  margin-left: 5px;
  float: right;
`

const MultiLineIcon = styled(MultiLineSVG)`
  width: 40px;
  height: 40px;
`

const CircleRangeIcon = styled(CircleRangeSVG)`
  width: 40px;
  height: 40px;
`

const MeasurementOptions = styled(MapComponentStyle)`
  width: 175px;
  margin-right: ${props => props.measurementBoxIsOpen ? '45px' : '-200px'};
  opacity: ${props => props.measurementBoxIsOpen ? '1' : '0'};
  top: ${MEASUREMENT_POSITION_FROM_TOP};
  right: 10px;
  border-radius: 2px;
  position: absolute;
  display: inline-block;
  transition: all 0.5s;
`


const MeasurementIcon = styled(MeasurementSVG)`
  width: 40px;
  opacity: ${props => props.$selectedVessel && !props.$rightMenuIsOpen ? '0' : '1'};
  transition: all 0.2s;
`

export default Measurement
