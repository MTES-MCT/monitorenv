import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

interface ImageViewerProps {
  currentIndex?: number
  images: string[]
  onClose: () => void
}

export function ImageViewer({ currentIndex, images, onClose }: ImageViewerProps) {
  const [localCurrentIndex, setLocalCurrentIndex] = useState(currentIndex ?? 0)

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

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key === 'ArrowLeft') {
        changeImage(-1)
      }

      if (event.key === 'ArrowRight') {
        changeImage(1)
      }
    },
    [onClose, changeImage]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <>
      <Wrapper onKeyDown={handleKeyDown}>
        <CloseButton>
          <IconButton
            accent={Accent.TERTIARY}
            color={THEME.color.white}
            Icon={Icon.Close}
            iconSize={30}
            onClick={onClose}
          />
        </CloseButton>

        {images.length > 1 && (
          <Navigation $isPrev onClick={() => changeImage(-1)}>
            <IconButton
              accent={Accent.TERTIARY}
              color={THEME.color.white}
              Icon={Icon.FilledArrow}
              iconSize={40}
              onClick={() => changeImage(-1)}
            />
          </Navigation>
        )}

        <Content>
          <Slide>
            <StyledImage alt="" src={images[localCurrentIndex]} />
          </Slide>
        </Content>
        {images.length > 1 && (
          <Navigation $isNext onClick={() => changeImage(1)}>
            <IconButton
              accent={Accent.TERTIARY}
              color={THEME.color.white}
              Icon={Icon.FilledArrow}
              iconSize={40}
              onClick={() => changeImage(1)}
            />
          </Navigation>
        )}
      </Wrapper>
      <Background />
    </>
  )
}

const Background = styled.div`
  background-color: ${p => p.theme.color.charcoal};
  bottom: 0;
  left: 0;
  opacity: 0.9;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;
`
const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 2;
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
const CloseButton = styled.div`
  display: flex;
  justify-content: end;
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2;
`
const Navigation = styled.div<{ $isNext?: boolean; $isPrev?: boolean }>`
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
