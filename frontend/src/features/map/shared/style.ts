import styled from 'styled-components'

export const NumberOfFilters = styled.div`
  position: absolute;
  top: -9px;
  right: -5px;
  font-size: 12px;
  background-color: ${p => p.theme.color.maximumRed};
  border-radius: 50%;
  color: ${p => p.theme.color.white};
  width: 20px;
  height: 20px;
  margin: auto;
  text-align: center;
`
