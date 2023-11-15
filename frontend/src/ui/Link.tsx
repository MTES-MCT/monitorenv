import styled from 'styled-components'

export const Link = styled.a`
  color: ${p => (p.tagUrl ? p.theme.color.gainsboro : p.theme.color.gunMetal)};
  font-size: 13px;
  cursor: pointer;
  ${p => (!p.tagUrl ? 'font-weight: 500;' : '')}
`
