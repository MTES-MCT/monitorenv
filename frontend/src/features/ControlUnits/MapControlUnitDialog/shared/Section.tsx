import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Body = styled.div`
  background-color: ${p => p.theme.color.white};
  padding: 24px 32px;
`

const Title = styled.div`
  background-color: ${p => p.theme.color.slateGray};
  color: ${p => p.theme.color.white};
  font-weight: medium;
  line-height: 1;
  padding: 5px 32px 7px;
`

export const Section = Object.assign(Wrapper, {
  Body,
  Title
})
