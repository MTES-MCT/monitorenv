import styled from 'styled-components'

export const SubTitle = styled.h2`
  border-bottom: ${p => `1px solid ${p.theme.color.lightGray}`};
  font-size: 16px;
  color: ${p => p.theme.color.slateGray};
  margin-bottom: 16px;
  margin-top: 24px;
  padding-top: 10px;
  padding-bottom: 10px;
`
