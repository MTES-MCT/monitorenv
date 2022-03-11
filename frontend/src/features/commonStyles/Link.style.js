import styled from 'styled-components'
import { COLORS } from '../../constants/constants'

export const Link = styled.a`
  color: ${props => props.tagUrl ? COLORS.gainsboro : COLORS.gunMetal};
  font-size: 13px;
  padding: 0px 8px;
  cursor: pointer;
  ${props => !props.tagUrl ? 'font-weight: 500;' : ''}
`
