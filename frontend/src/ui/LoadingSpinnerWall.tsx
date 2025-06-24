import { FulfillingBouncingCircleLoader, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export type LoadingSpinnerWallProps = {
  message?: string
}

export function LoadingSpinnerWall({ message = 'Chargement...' }: LoadingSpinnerWallProps) {
  return (
    <Wrapper data-cy="first-loader">
      <FulfillingBouncingCircleLoader className="update-vessels" color={THEME.color.lightGray} size={48} />
      <StyledLoadingMessage>{message}</StyledLoadingMessage>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
`
const StyledLoadingMessage = styled.p`
  margin-top: 16px;
`
