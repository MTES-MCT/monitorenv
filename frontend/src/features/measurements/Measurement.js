import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { useClickOutsideComponent } from '../../hooks/useClickOutside'
import { useEscapeFromKeyboard } from '../../hooks/useEscapeFromKeyboard'

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
import { IconButton } from 'rsuite'

const MEASUREMENT_POSITION_FROM_LEFT = 440

const MeasurementIconSelector = ({measurementType, small}) => {
  switch (measurementType) {
    case MeasurementTypes.MULTILINE:
      return <MultiLineIcon style={small && {width: '20px', height: '20px'} } className={'rs-icon'} />
    case MeasurementTypes.CIRCLE_RANGE:
      return <CircleRangeIcon className={'rs-icon'} />
    default:
      return <MeasurementIcon className={'rs-icon'} />
  }
}

const Measurement = () => {
  const dispatch = useDispatch()
  const {  measurementTypeToAdd } = useSelector(state => state.measurement)

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
    <MeasurementWrapper>
      <IconButton
        title={'prendre une mesure'}
        data-cy={'measurement'}
        onClick={openOrCloseMeasurement}
        appearance='primary'
        size='sm'
        icon={<MeasurementIconSelector small measurementType={measurementTypeToAdd} />}
        >
      </IconButton>
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
        positionFromTop={MEASUREMENT_POSITION_FROM_LEFT}
        measurementIsOpen={measurementIsOpen}
        measurementTypeToAdd={measurementTypeToAdd}
        circleCoordinatesToAdd={circleCoordinatesToAdd}
        circleRadiusToAdd={circleRadiusToAdd}
        setCircleCoordinatesToAdd={setCircleCoordinatesToAdd}
        setCircleRadiusToAdd={setCircleRadiusToAdd}
        cancelAddCircleRange={cancelAddCircleRange}
        addCustomCircleRange={addCustomCircleRange}/>
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
  :not(:first-child){
    margin-left: 5px;
  }
`

const MultiLineIcon = styled(MultiLineSVG)`
`

const CircleRangeIcon = styled(CircleRangeSVG)`
`

const MeasurementIcon = styled(MeasurementSVG)`
  width: 20px;
  height: 20px;
`

const MeasurementOptions = styled(MapComponentStyle)`
  width: 175px;
  margin-bottom: ${props => props.measurementBoxIsOpen ? '8px' : '-200px'};
  opacity: ${props => props.measurementBoxIsOpen ? '1' : '0'};
  position: absolute;
  bottom: 20px;
  left: 0;
  text-align: left;
  border-radius: 2px;
  display: inline-block;
  transition: all 0.5s;
`

export default Measurement
