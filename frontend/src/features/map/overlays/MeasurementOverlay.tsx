import { Accent, Icon, IconButton, Size, THEME, pluralize } from '@mtes-mct/monitor-ui'
import Overlay from 'ol/Overlay'
import { type MutableRefObject, useEffect, useCallback, useRef, useMemo } from 'react'
import styled from 'styled-components'

import { DistanceUnit, OLGeometryType } from '../../../domain/entities/map/constants'
import { useAppSelector } from '../../../hooks/useAppSelector'

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
  const distanceUnit = useAppSelector(state => state.map.distanceUnit)

  const overlayRef = useRef()
  const olOverlayObjectRef = useRef() as MutableRefObject<Overlay>
  const overlayCallback = useCallback(
    ref => {
      overlayRef.current = ref
      if (ref) {
        olOverlayObjectRef.current = new Overlay({
          className: `ol-overlay-container ol-selectable measurement-overlay`,
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
          <StyledIconButton
            accent={Accent.TERTIARY}
            color={THEME.color.slateGray}
            data-cy="close-measurement"
            Icon={Icon.Close}
            onClick={() => deleteFeature && deleteFeature(id)}
            size={Size.SMALL}
          />
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

const ZoneText = styled.div`
  margin: 0px 8px;
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
`

const ZoneSelected = styled.div`
  background: ${p => p.theme.color.gainsboro};
  border-radius: 2px;
  display: flex;
  user-select: none;
`

const StyledIconButton = styled(IconButton)`
  border-left: 1px solid ${p => p.theme.color.white};
  > div > svg {
    height: 13px;
    width: 13px;
  }
`
