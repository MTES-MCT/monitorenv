import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { scrollToSection } from '../Columns/utils'

import type { RefObject } from 'react'

export type BookmarkType = {
  orientation?: 'top' | 'bottom'
  ref: RefObject<HTMLDivElement>
  title: string
  visible: boolean
}

type BookmarkProps = {
  bottomBookmarks: BookmarkType[]
  columnWidth?: number
  topBookmarks: BookmarkType[]
}
export function Bookmark({ bottomBookmarks, columnWidth, topBookmarks }: BookmarkProps) {
  return (
    <>
      <Wrapper $left={columnWidth ?? 0}>
        {topBookmarks.map(bookmark => (
          <ButtonUp
            key={bookmark.title}
            accent={Accent.TERTIARY}
            Icon={Icon.DoubleChevron}
            onClick={() => scrollToSection(bookmark.ref)}
          >
            {bookmark.title}
          </ButtonUp>
        ))}
      </Wrapper>
      <BottomWrapper $left={columnWidth ?? 0}>
        {bottomBookmarks.map(bookmark => (
          <ButtonDown
            key={bookmark.title}
            accent={Accent.TERTIARY}
            Icon={Icon.DoubleChevron}
            onClick={() => scrollToSection(bookmark.ref)}
          >
            {bookmark.title}
          </ButtonDown>
        ))}
      </BottomWrapper>
    </>
  )
}

export const ButtonDown = styled(Button)`
  box-shadow: 0px 3px 6px ${p => p.theme.color.gainsboro};
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: 24px;
  border: 1px solid ${p => p.theme.color.gainsboro};
`

export const ButtonUp = styled(ButtonDown)`
  .Element-IconBox {
    transform: rotate(180deg);
  }
`

export const Wrapper = styled.div<{ $left: number }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  font-weight: bold;
  font-style: italic;
  margin-left: ${({ $left }) => `${$left}`};
  transform: translateX(-100%);
  margin-top: -16px;
  position: fixed;
  box-shadow: 0px 3px 6px ${p => p.theme.color.gainsboro};
  z-index: 1000;
`

export const BottomWrapper = styled(Wrapper)`
  bottom: 74px;
`
