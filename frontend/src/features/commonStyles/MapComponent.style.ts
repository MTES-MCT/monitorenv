import styled from 'styled-components'

export const MapComponentStyle = styled.div<{
  $healthcheckTextWarning: boolean
  $isHidden?: boolean
}>`
  margin-top: ${props => (props.$healthcheckTextWarning ? 50 : 0)}px;
  visibility: ${props => (props.$isHidden ? 'hidden' : 'visible')};
`
