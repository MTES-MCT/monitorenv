import { VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { Accent, Icon, IconButton, Size, usePrevious } from '@mtes-mct/monitor-ui'
import { noop } from 'lodash/fp'
import LineString from 'ol/geom/LineString'
import Overlay from 'ol/Overlay'
import { getLength } from 'ol/sphere'
import { createRef, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map/constants'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useMoveOverlayWhenDragging } from '../../../hooks/useMoveOverlayWhenDragging'
import { getCoordinates } from '../../../utils/coordinates'

import type { InterestPoint, NewInterestPoint } from '@features/InterestPoint/types'
import type { Coordinate } from 'ol/coordinate'

const X = 0
const Y = 1
export const initialOffsetValue = [-90, 10]

// TODO Move that into a utils file.
function coordinatesAreModified(nextCoordinates: Coordinate, previousCoordinates: Coordinate): boolean {
  return (
    !Number.isNaN(nextCoordinates[0]) &&
    !Number.isNaN(nextCoordinates[1]) &&
    !Number.isNaN(previousCoordinates[0]) &&
    !Number.isNaN(previousCoordinates[1]) &&
    (nextCoordinates[0] !== previousCoordinates[0] || nextCoordinates[1] !== previousCoordinates[1])
  )
}

type InterestPointOverlayProps = {
  deleteInterestPoint: (uuid: string) => void
  interestPoint: InterestPoint | NewInterestPoint
  isVisible: boolean
  map: any
  modifyInterestPoint: (uuid: string) => void
  moveLine: (uuid: string, previousCoordinates: number[], nextCoordinates: number[], offset: number[]) => void
}
export function InterestPointOverlay({
  deleteInterestPoint,
  interestPoint: { coordinates, name, observations, uuid },
  isVisible,
  map,
  modifyInterestPoint,
  moveLine
}: InterestPointOverlayProps) {
  const { coordinatesFormat } = useAppSelector(state => state.map)

  const hasMapInteraction = useHasMapInteraction()
  const isDrawingVigilanceArea = useAppSelector(
    state => state.vigilanceArea.formTypeOpen === VigilanceAreaFormTypeOpen.DRAW
  )

  const ref = createRef<HTMLDivElement>()
  const currentOffset = useRef(initialOffsetValue)
  const currentCoordinates = useRef([])
  const interestPointCoordinates = useRef(coordinates)
  const [isMounted, setIsMounted] = useState(false)
  const isThrottled = useRef(false)
  const overlayRef = useRef<Overlay | null>(null)
  const setOverlayRef = () => {
    if (overlayRef.current === null) {
      overlayRef.current = new Overlay({
        autoPan: false,
        element: ref.current ?? undefined,
        offset: currentOffset.current,
        position: coordinates ?? undefined,
        positioning: 'center-left'
      })
    }
  }
  setOverlayRef()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const moveLineWithThrottle = useCallback(
    (target, delay) => {
      if (isThrottled.current) {
        return
      }

      isThrottled.current = true
      window.setTimeout(() => {
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

    [map, moveLine, uuid]
  )

  useMoveOverlayWhenDragging({
    currentOffset,
    map,
    moveLineWithThrottle,
    overlay: overlayRef.current,
    showed: isMounted
  })
  const previousCoordinates = usePrevious(coordinates)

  useEffect(() => {
    interestPointCoordinates.current = coordinates

    if (coordinates && previousCoordinates && coordinatesAreModified(coordinates, previousCoordinates)) {
      const line = new LineString([coordinates, previousCoordinates])
      const distance = getLength(line, { projection: OPENLAYERS_PROJECTION })

      if (distance > 10) {
        currentOffset.current = initialOffsetValue
        overlayRef.current?.setOffset(initialOffsetValue)
      }
    }
  }, [coordinates, previousCoordinates])

  useEffect(() => {
    if (map) {
      overlayRef.current?.setPosition(coordinates ?? undefined)
      overlayRef.current?.setElement(ref.current ?? undefined)

      map.addOverlay(overlayRef.current)

      return () => {
        map.removeOverlay(overlayRef.current)
      }
    }

    return noop
  }, [coordinates, map, ref])

  const isDisabled = !!hasMapInteraction || isDrawingVigilanceArea

  return (
    <WrapperToBeKeptForDOMManagement>
      <div ref={ref}>
        {isVisible ? (
          <InterestPointOverlayElement>
            <Header>
              <Name data-cy="interest-point-name" title={name ?? 'Aucun Libellé'}>
                {name ?? 'Aucun Libellé'}
              </Name>
              <IconButton
                accent={Accent.TERTIARY}
                data-cy="interest-point-edit"
                disabled={isDisabled}
                Icon={Icon.Edit}
                onClick={() => modifyInterestPoint(uuid)}
                size={Size.SMALL}
                title="Editer"
              />
              <IconButton
                accent={Accent.TERTIARY}
                data-cy="interest-point-delete"
                disabled={isDisabled}
                Icon={Icon.Delete}
                onClick={() => deleteInterestPoint(uuid)}
                size={Size.SMALL}
                title="Supprimer"
              />
            </Header>
            <Body data-cy="interest-point-observations">{observations ?? 'Aucune observation'}</Body>
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

const Body = styled.p`
  padding: 10px;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
  word-wrap: break-word;
`

const Footer = styled.footer`
  padding: 3px;
  font-size: 12px;
  text-align: center;
  color: ${p => p.theme.color.slateGray};
`

const Header = styled.header`
  display: flex;
  height: 30px;
  background: ${p => p.theme.color.gainsboro};
  text-align: left;
  border: none;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`

const WrapperToBeKeptForDOMManagement = styled.div`
  z-index: 300;
`

const InterestPointOverlayElement = styled.section`
  background: ${p => p.theme.color.white};
  cursor: grabbing;
  width: 183px;
  color: ${p => p.theme.color.gunMetal};
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
