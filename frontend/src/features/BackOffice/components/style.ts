import styled from 'styled-components'

export const TitleContainer = styled.div`
  border-bottom: 1px solid ${p => p.theme.color.gainsboro};
  display: flex;
  justify-content: space-between;

  > Button {
    align-self: start;
  }
`

export const Title = styled.h1`
  line-height: 1;
  font-size: 24px;
  margin: 0 0 24px;
`

export const BackofficeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  padding: 24px;
  gap: 16px;
`
