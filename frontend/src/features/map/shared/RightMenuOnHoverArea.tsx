import { useRef } from 'react'
import styled from 'styled-components'

import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { mainWindowActions } from '../../MainWindow/slice'

export function RightMenuOnHoverArea() {
  const areaRef = useRef(null)

  const dispatch = useAppDispatch()
  const hasFullHeightRightDialogOpen = useAppSelector(state => state.mainWindow.hasFullHeightRightDialogOpen)
  const isRightMenuOpened = useAppSelector(state => state.mainWindow.isRightMenuOpened)

  const onMouseEnter = () => {
    dispatch(mainWindowActions.setIsRightMenuOpened(true))
  }

  // const clickedOutsideComponent = useClickOutsideWhenOpened(areaRef, hasFullHeightRightDialogOpen)
  // useEffect(() => {
  //   if (clickedOutsideComponent) {
  //     dispatch(mainWindowActions.setIsRightMenuOpened(false))
  //   }

  //   // to prevent re-render
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [clickedOutsideComponent])

  return hasFullHeightRightDialogOpen ? (
    <Area ref={areaRef} $isRightMenuOpened={isRightMenuOpened} onMouseEnter={onMouseEnter} />
  ) : (
    <></>
  )
}

const Area = styled.div<{
  $isRightMenuOpened: boolean
}>`
  height: 500px;
  position: absolute;
  right: 0;
  top: 56px;
  width: ${p => (!p.$isRightMenuOpened ? 10 : 60)}px;
  z-index: ${p => (!p.$isRightMenuOpened ? 1000 : 0)};
`
