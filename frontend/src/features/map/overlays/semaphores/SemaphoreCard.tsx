import styled from 'styled-components'

export function SemaphoreCard({ feature }: { feature: any }) {
  const { email, nom, telephone, unite } = feature.getProperties()

  return (
    <Wrapper data-cy="semaphore-overlay">
      <StyledTitle>{unite ?? nom.toLowerCase()}</StyledTitle>
      <StyledContactContainer>
        {telephone && <span>Contact&nbsp;:&nbsp;{telephone}</span>}
        {email && <span>{email}</span>}
      </StyledContactContainer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 10px;
  box-shadow: 0px 3px 6px #70778540;
  border-radius: 1px;
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  flex: 0 0 260px;
  gap: 4px;
`
const StyledTitle = styled.div`
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
  color: ${p => p.theme.color.gunMetal};
`
const StyledContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  font: normal normal normal 13px/18px Marianne;
  color: ${p => p.theme.color.slateGray};
`
