import { useEscapeKey } from '@hooks/useEscapeKey'
import { Accent, Icon, IconButton, THEME, useNewWindow } from '@mtes-mct/monitor-ui'
import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import type { ImageFrontProps } from '../types'

interface ImageViewerProps {
  currentIndex?: number
  images: ImageFrontProps[]
  isSideWindow?: boolean
  onClose: () => void
}

export function ImageViewer({ currentIndex, images, isSideWindow = false, onClose }: ImageViewerProps) {
  const [localCurrentIndex, setLocalCurrentIndex] = useState(currentIndex ?? 0)
  const { newWindowContainerRef } = useNewWindow()

  const changeImage = useCallback(
    (delta: number) => {
      let nextIndex = (localCurrentIndex + delta) % images.length
      if (nextIndex < 0) {
        nextIndex = images.length - 1
      }
      setLocalCurrentIndex(nextIndex)
    },
    [images.length, localCurrentIndex]
  )

  useEscapeKey({
    onArrowLeft: () => changeImage(-1),
    onArrowRight: () => changeImage(1),
    onEscape: () => onClose(),
    ref: isSideWindow ? newWindowContainerRef : undefined
  })

  const imageViewerContent = (
    <>
      <Wrapper>
        <CloseButton
          accent={Accent.TERTIARY}
          color={THEME.color.white}
          Icon={Icon.Close}
          iconSize={30}
          onClick={onClose}
        />

        {images.length > 1 && (
          <Navigation
            $isPrev
            accent={Accent.TERTIARY}
            color={THEME.color.white}
            Icon={Icon.FilledArrow}
            iconSize={40}
            onClick={() => changeImage(-1)}
          />
        )}

        <Content>
          <Slide>
            <StyledImage alt={images[localCurrentIndex]?.name} src={images[localCurrentIndex]?.image} />
          </Slide>
        </Content>
        {images.length > 1 && (
          <Navigation
            $isNext
            accent={Accent.TERTIARY}
            color={THEME.color.white}
            Icon={Icon.FilledArrow}
            iconSize={40}
            onClick={() => changeImage(1)}
          />
        )}
      </Wrapper>
      <Background />
    </>
  )

  return createPortal(imageViewerContent, isSideWindow ? newWindowContainerRef.current : (document.body as HTMLElement))
}

const Background = styled.div`
  background-color: ${p => p.theme.color.charcoal};
  bottom: 0;
  left: 0;
  opacity: 0.9;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10;
`
const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 11;
`

const Content = styled.div`
  margin: auto;
  padding: 0;
  width: 90%;
  height: 100%;
  max-height: 100%;
  text-align: center;
`

const Slide = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledImage = styled.img`
  max-height: 100%;
  max-width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
`
const CloseButton = styled(IconButton)`
  display: flex;
  justify-content: end;
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2;
`
const Navigation = styled(IconButton)<{ $isNext?: boolean; $isPrev?: boolean }>`
  position: absolute;
  display: flex;
  align-items: center;
  padding: 0 15px;
  user-select: none;
  height: 100%;
  -moz-user-select: none;
  -webkit-user-select: none;
  top: 0px;

  ${props => props.$isPrev && `left: 0; rotate: 180deg;`}
  ${props => props.$isNext && `right: 0;`}
`
