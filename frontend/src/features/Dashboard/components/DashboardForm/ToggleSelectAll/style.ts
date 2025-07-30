import styled from 'styled-components'

export const SelectedPinButton = styled.button`
  background-color: ${p => p.theme.color.white};
  color: ${p => p.theme.color.slateGray};
  display: flex;
  flex-grow: 1;
  justify-content: right;
  gap: 4px;
  text-decoration: underline;
`
