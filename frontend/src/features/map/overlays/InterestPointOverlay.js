import LineString from 'ol/geom/LineString'
import Overlay from 'ol/Overlay'
import { getLength } from 'ol/sphere'
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map/constants'
import { useMoveOverlayWhenDragging } from '../../../hooks/useMoveOverlayWhenDragging'
import { usePrevious } from '../../../hooks/usePrevious'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as EditSVG } from '../../../uiMonitor/icons/Edit.svg'
import { getCoordinates } from '../../../utils/coordinates'

const X = 0
const Y = 1
export const initialOffsetValue = [-90, 10]

function InterestPointOverlay({
  coordinates,
  deleteInterestPoint,
  featureIsShowed,
  map,
  modifyInterestPoint,
  moveLine,
  name,
  observations,
  uuid
}) {
  const { coordinatesFormat } = useSelector(state => state.map)

  const ref = createRef()
  const currentOffset = useRef(initialOffsetValue)
  const currentCoordinates = useRef([])
  const interestPointCoordinates = useRef(coordinates)
  const isThrottled = useRef(false)
  const [showed, setShowed] = useState(false)
  const overlayRef = useRef(null)
  const setOverlayRef = () => {
    if (overlayRef.current === null) {
      overlayRef.current = new Overlay({
        autoPan: false,
        element: ref.current,
        offset: currentOffset.current,
        position: coordinates,
        positioning: 'left-center'
      })
    }
  }
  setOverlayRef()

  const moveInterestPointWithThrottle = useCallback(
    (target, delay) => {
      if (isThrottled.current) {
        return
      }

      isThrottled.current = true
      setTimeout(() => {
        if (interestPointCoordinates.current) {
          const offset = target.getOffset()
          const pixel = map.getPixelFromCoordinate(interestPointCoordinates.current)

          const { width } = target.getElement().getBoundingClientRect()
          const nextXPixelCenter = pixel[X] + offset[X] + width / 2
          const nextYPixelCenter = pixel[Y] + offset[Y]

          const nextCoordinates = map.getCoordinateFromPixel([nextXPixelCenter, nextYPixelCenter])
          currentCoordinates.current = nextCoordinates
          moveLine(uuid, interestPointCoordinates.current, nextCoordinates, offset)

          isThrottled.current = false
        }
      }, delay)
    },
    [interestPointCoordinates.current]
  )

  useMoveOverlayWhenDragging(overlayRef.current, map, currentOffset, moveInterestPointWithThrottle, showed)
  const previousCoordinates = usePrevious(coordinates)

  function coordinatesAreModified(coordinates, previousCoordinates) {
    return (
      !isNaN(coordinates[0]) &&
      !isNaN(coordinates[1]) &&
      !isNaN(previousCoordinates[0]) &&
      !isNaN(previousCoordinates[1]) &&
      (coordinates[0] !== previousCoordinates[0] || coordinates[1] !== previousCoordinates[1])
    )
  }

  useEffect(() => {
    interestPointCoordinates.current = coordinates

    if (coordinates && previousCoordinates && coordinatesAreModified(coordinates, previousCoordinates)) {
      const line = new LineString([coordinates, previousCoordinates])
      const distance = getLength(line, { projection: OPENLAYERS_PROJECTION })

      if (distance > 10) {
        currentOffset.current = initialOffsetValue
        overlayRef.current.setOffset(initialOffsetValue)
      }
    }
  }, [coordinates])

  useEffect(() => {
    if (map) {
      overlayRef.current.setPosition(coordinates)
      overlayRef.current.setElement(ref.current)

      map.addOverlay(overlayRef.current)
      if (featureIsShowed) {
        setShowed(true)
      }

      return () => {
        map.removeOverlay(overlayRef.current)
      }
    }
  }, [overlayRef.current, coordinates, map])

  return (
    <WrapperToBeKeptForDOMManagement>
      <div ref={ref}>
        {showed ? (
          <InterestPointOverlayElement>
            <Header>
              <Name data-cy="interest-point-name" title={name || 'Aucun Libellé'}>
                {name || 'Aucun Libellé'}
              </Name>
              <Edit data-cy="interest-point-edit" onClick={() => modifyInterestPoint(uuid)} />
              <Delete data-cy="interest-point-delete" onClick={() => deleteInterestPoint(uuid)} />
            </Header>
            <Body data-cy="interest-point-observations">{observations || 'Aucune observation'}</Body>
            <Footer data-cy="interest-point-coordinates">
              {coordinates && coordinates.length
                ? getCoordinates(coordinates, OPENLAYERS_PROJECTION, coordinatesFormat).join(' ')
                : null}
            </Footer>
          </InterestPointOverlayElement>
        ) : null}
      </div>
    </WrapperToBeKeptForDOMManagement>
  )
}

const Body = styled.div`
  padding: 10px;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  border-bottom: 1px solid ${COLORS.lightGray};
`

const Footer = styled.div`
  padding: 3px;
  font-size: 12px;
  text-align: center;
  color: ${COLORS.slateGray};
`

const Header = styled.div`
  display: flex;
  height: 30px;
  background ${COLORS.gainsboro};
  text-align: left;
  border: none;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`

const Delete = styled(DeleteSVG)`
  height: 30px;
  width: 22px;
  border-left: 1px solid ${COLORS.lightGray};
  padding-left: 6px;
  margin-left: auto;
  margin-right: 8px;
  cursor: pointer;
`

const Edit = styled(EditSVG)`
  height: 30px;
  width: 22px;
  border-left: 1px solid ${COLORS.lightGray};
  padding-left: 6px;
  margin-left: auto;
  margin-right: 6px;
  cursor: pointer;
`

const WrapperToBeKeptForDOMManagement = styled.div`
  z-index: 300;
`

const InterestPointOverlayElement = styled.div`
  background: ${COLORS.background};
  cursor: grabbing;
  width: 183px;
  color: ${COLORS.gunMetal};
  border: none;
  border-radius: 2px;
`

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
  display: inline-block;
  margin-left: 2px;
  padding: 6px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 0;
`

export default InterestPointOverlay
