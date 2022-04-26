import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from "styled-components"

import { expandRightMenu } from '../../../domain/shared_slices/Global'
import { COLORS } from '../../../constants/constants'


export const RightMenuButton = ({top, title, button, onClick, children}) => {
  const dispatch = useDispatch()
  const {  rightMenuIsOpen } = useSelector(state => state.global)
  const wrapperRef = useRef(null)

  const [menuOptionIsOpen, setMenuOptionIsOpen] = useState(false)

  const handleMenuButtonOnClick = () => {
    typeof(onClick) === 'function' && onClick()
    setMenuOptionIsOpen(!menuOptionIsOpen)

  }
  const handleButtonHover = () => dispatch(expandRightMenu())

  return (
    <Wrapper ref={wrapperRef}>
      <Button 
        $top={top} 
        title={title}
        rightMenuIsOpen={rightMenuIsOpen}
        onMouseEnter={handleButtonHover}
        onClick={handleMenuButtonOnClick}
        >
        {button}
      </Button>
      {children && <OptionsWrapper $top={top} $menuOptionIsOpen={menuOptionIsOpen}>
        {children}
      </OptionsWrapper>}
    </Wrapper>
  )
}


const Wrapper = styled.div`
  transition: all 0.2s;
  z-index: 1000;
`

const Button = styled.button`
  position: absolute;
  display: inline-block;
  color: ${COLORS.blue};
  top: ${props => props.$top}px;
  z-index: 99;
  height: 40px;
  width: ${props => !props.rightMenuIsOpen ? '5px' : '40px'};
  border-radius: ${props => !props.rightMenuIsOpen ? '1px' : '2px'};
  right: ${props => !props.rightMenuIsOpen ? '0' : '10px'};
  transition: all 0.3s;
  background: ${props => props.isOpen ? COLORS.shadowBlue : COLORS.charcoal};

  :hover, :focus {
    background: ${props => props.isOpen ? COLORS.shadowBlue : COLORS.charcoal};
  }
`
const OptionsWrapper = styled.div`
  margin-right: ${props => props.$menuOptionIsOpen ? '45px' : '-1000px'};
  opacity: ${props => props.$menuOptionIsOpen ? '1' : '0'};
  top: ${props => props.$top}px;
  right: 10px;
  border-radius: 2px;
  position: absolute;
  display: inline-block;
  transition: all 0.5s;
`
