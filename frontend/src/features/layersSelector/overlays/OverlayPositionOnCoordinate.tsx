import Overlay from 'ol/Overlay'
import { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'

import type OpenLayerMap from 'ol/Map'

type OverlayPositionOnCoordinatesProps = {
  children: React.ReactNode
  coordinates: number[] | undefined
  layerOverlayIsOpen: boolean
  map: OpenLayerMap
}
export function OverlayPositionOnCoordinates({
  children,
  coordinates,
  layerOverlayIsOpen,
  map
}: OverlayPositionOnCoordinatesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const olOverlayRef = useRef<Overlay | null>(null)

  const attachContentToOverlay = useCallback(
    (ref: HTMLDivElement) => {
      containerRef.current = ref
      if (ref) {
        olOverlayRef.current = new Overlay({
          className: `ol-overlay-container ol-selectable layer-overlay`,
          element: ref
        })
      } else {
        olOverlayRef.current = null
      }
    },
    [containerRef, olOverlayRef]
  )

  useEffect(() => {
    if (map && olOverlayRef.current) {
      map.addOverlay(olOverlayRef.current)
    }

    return () => {
      if (map && olOverlayRef.current) {
        map.removeOverlay(olOverlayRef.current)
      }
    }
  }, [map, olOverlayRef])

  useEffect(() => {
    if (containerRef.current) {
      if (layerOverlayIsOpen) {
        containerRef.current.style.display = 'block'
        olOverlayRef.current?.setPosition(coordinates)
      } else {
        containerRef.current.style.display = 'none'
      }
    }
  }, [layerOverlayIsOpen, coordinates])

  return <Container ref={attachContentToOverlay}>{layerOverlayIsOpen && children}</Container>
}

const Container = styled.div``
