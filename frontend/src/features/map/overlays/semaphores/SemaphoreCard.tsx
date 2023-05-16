import styled from 'styled-components'

export function SemaphoreCard({ feature }) {
  const { unite } = feature.getProperties()

  return <Wrapper data-cy="semaphore-overlay">{unite}</Wrapper>
}

const Wrapper = styled.div`
  padding: 10px;
  box-shadow: 0px 3px 6px #70778540;
  border-radius: 1px;
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 0 0 260px;
`
