import { Icon, THEME } from '@mtes-mct/monitor-ui'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { CustomCircleRange } from './CustomCircleRange'
import { MapToolType, MeasurementType } from '../../../../domain/entities/map/constants'
import { setisMapToolVisible } from '../../../../domain/shared_slices/Global'
import { setMeasurementTypeToAdd } from '../../../../domain/shared_slices/Measurement'
import { ReportingFormVisibility } from '../../../../domain/shared_slices/ReportingState'
import { reduceReportingForm } from '../../../../domain/use_cases/reduceReportingForm'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useClickOutsideWhenOpenedAndExecute } from '../../../../hooks/useClickOutsideWhenOpenedAndExecute'
import { useEscapeFromKeyboardAndExecute } from '../../../../hooks/useEscapeFromKeyboardAndExecute'
import { MapComponentStyle } from '../../../commonStyles/MapComponent.style'
import { MapToolButton } from '../MapToolButton'

export function MeasurementMapButton() {
  const dispatch = useAppDispatch()
  const { measurementTypeToAdd } = useAppSelector(state => state.measurement)
  const { displayMeasurement, healthcheckTextWarning, isMapToolVisible, reportingFormVisibility } = useAppSelector(
    state => state.global
  )

  const isOpen = useMemo(() => isMapToolVisible === MapToolType.MEASUREMENT_MENU, [isMapToolVisible])
  const isMeasurementToolOpen = useMemo(() => isMapToolVisible === MapToolType.MEASUREMENT, [isMapToolVisible])
  const wrapperRef = useRef(null)

  useClickOutsideWhenOpenedAndExecute(wrapperRef, isOpen, () => {
    dispatch(setisMapToolVisible(undefined))
  })

  useEscapeFromKeyboardAndExecute(() => {
    dispatch(setMeasurementTypeToAdd(undefined))
    dispatch(setisMapToolVisible(undefined))
  })

  useEffect(() => {
    if (!isOpen && !isMeasurementToolOpen && !!measurementTypeToAdd) {
      dispatch(setMeasurementTypeToAdd(undefined))
    }
  }, [dispatch, isOpen, isMeasurementToolOpen, measurementTypeToAdd])

  const makeMeasurement = nextMeasurementTypeToAdd => {
    dispatch(setMeasurementTypeToAdd(nextMeasurementTypeToAdd))
    dispatch(setisMapToolVisible(MapToolType.MEASUREMENT))
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
      dispatch(setisMapToolVisible(undefined))
    } else {
      dispatch(setisMapToolVisible(MapToolType.MEASUREMENT_MENU))
    }
    dispatch(reduceReportingForm())
  }, [dispatch, measurementTypeToAdd])

  return (
    <Wrapper ref={wrapperRef} reportingFormVisibility={reportingFormVisibility}>
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
    </Wrapper>
  )
}

const MeasurementItem = styled.div`
  background: ${p => p.theme.color.blueGray[100]};
  border-radius: 2px;
  cursor: pointer;
  float: right;
  height: 40px;
  margin-left: 5px;
  position: relative;
  width: 40px;
  padding: 8px;
`

const Wrapper = styled.div<{ reportingFormVisibility: ReportingFormVisibility }>`
  position: absolute;
  right: ${p => (p.reportingFormVisibility === ReportingFormVisibility.VISIBLE ? '0' : '10')}px;
  top: 270px;
  transition: right 0.3s ease-out;
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
