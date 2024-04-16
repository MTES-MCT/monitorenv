import styled from 'styled-components'

export const FormTitle = styled.h2`
  font-size: 16px;
  line-height: 22px;
  color: ${p => p.theme.color.charcoal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Separator = styled.div`
  border-top: 1px solid ${p => p.theme.color.charcoal};
  margin: 8px 0px;
`
