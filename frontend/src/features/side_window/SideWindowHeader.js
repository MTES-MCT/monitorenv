import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../../constants/constants'

export const SideWindowHeader = ({title, children}) => {

  return (<Wrapper>
    <Title>
      {title}
    </Title>
    {children}
  </Wrapper>)
}

const Wrapper = styled.div`
  background: ${COLORS.charcoal};
  padding-left: 8px;
  padding-right: 8px;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  `
  
  const Title = styled.h1`
  display: inline-block;
  color: ${COLORS.white};
  font-size: 22px;
  line-height: 50px;
  margin-left: 8px;
  margin-right: 8px;
`