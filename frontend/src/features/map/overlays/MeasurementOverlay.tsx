import { pluralize } from '@mtes-mct/monitor-ui'
import Overlay from 'ol/Overlay'
import { type MutableRefObject, useEffect, useCallback, useRef, useMemo } from 'react'
import styled from 'styled-components'

import { DistanceUnit, OLGeometryType } from '../../../domain/entities/map/constants'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ReactComponent as CloseIconSVG } from '../../../uiMonitor/icons/Close.svg'

type MeasurementOverlayProps = {
  coordinates: any[]
  deleteFeature?: Function
  id?: String
  map: any
  measurement: any
  type?: string
}

export function MeasurementOverlay({
  coordinates,
  deleteFeature,
  id,
  map,
  measurement,
  type
}: MeasurementOverlayProps) {
  const { distanceUnit } = useAppSelector(state => state.map)

  const overlayRef = useRef()
  const olOverlayObjectRef = useRef() as MutableRefObject<Overlay>
  const overlayCallback = useCallback(
    ref => {
      overlayRef.current = ref
      if (ref) {
        olOverlayObjectRef.current = new Overlay({
          className: `ol-overlay-container ol-selectable`,
          element: ref,
          offset: [0, -7],
          position: coordinates,
          positioning: 'bottom-center'
        })
      }
    },
    [overlayRef, olOverlayObjectRef, coordinates]
  )

  const measurementWithUnitDistance = useMemo(() => {
    const prefixe = type === OLGeometryType.POLYGON ? 'r = ' : ''
    if (distanceUnit === DistanceUnit.METRIC) {
      if (measurement < 1000) {
        return `${prefixe}${Math.round(measurement * 100) / 100} mètres`
      }

      return `${prefixe}${Math.round((measurement / 1000) * 100) / 100} ${pluralize(
        'km',
        Math.round(measurement / 1000)
      )}`
    }

    return `${prefixe}${measurement} nm`
  }, [distanceUnit, measurement, type])

  useEffect(() => {
    if (map) {
      map.addOverlay(olOverlayObjectRef.current)

      return () => {
        map.removeOverlay(olOverlayObjectRef.current)
      }
    }

    return () => {}
  }, [map, olOverlayObjectRef])

  return (
    <div>
      <MeasurementOverlayElement ref={overlayCallback}>
        <ZoneSelected>
          <ZoneText data-cy="measurement-value">{measurementWithUnitDistance}</ZoneText>
          <CloseIcon data-cy="close-measurement" onClick={() => deleteFeature && deleteFeature(id)} />
        </ZoneSelected>
        <TrianglePointer>
          <TriangleShadow />
        </TrianglePointer>
      </MeasurementOverlayElement>
    </div>
  )
}

const TrianglePointer = styled.div`
  margin-left: auto;
  margin-right: auto;
  height: auto;
  width: auto;
`

const TriangleShadow = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 11px 6px 0 6px;
  border-color: ${p => p.theme.color.gainsboro} transparent;
  text-align: center;
  margin: auto;
  margin-top: -3px;
`

const MeasurementOverlayElement = styled.div``

const ZoneText = styled.span`
  margin-bottom: 5px;
  vertical-align: middle;
  height: 30px;
  display: inline-block;
  user-select: none;
`

const ZoneSelected = styled.div`
  background: ${p => p.theme.color.gainsboro};
  border-radius: 2px;
  color: ${p => p.theme.color.slateGray};
  margin-left: 0;
  font-size: 13px;
  padding: 0px 3px 0px 7px;
  vertical-align: top;
  height: 30px;
  display: inline-block;
  user-select: none;
`

const CloseIcon = styled(CloseIconSVG)`
  width: 13px;
  vertical-align: text-bottom;
  cursor: pointer;
  border-left: 1px solid white;
  height: 30px;
  margin: 0 6px 0 7px;
  padding-left: 7px;
`
