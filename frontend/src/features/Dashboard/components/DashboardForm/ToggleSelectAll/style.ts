import styled from 'styled-components'

export const SelectedPinButton = styled.button`
  background-color: ${p => p.theme.color.white};
  color: ${p => p.theme.color.slateGray};
  display: flex;
  gap: 4px;
  text-decoration: underline;
`
