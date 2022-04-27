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
  width: 100%;
`

const Title = styled.h1`
  display: inline-block;
  color: ${COLORS.white}
`