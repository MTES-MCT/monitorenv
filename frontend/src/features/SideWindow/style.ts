import styled from 'styled-components'

export const Wrapper = styled.section`
  background: ${p => p.theme.color.white};
  display: flex;

  height: 100%;
  min-height: 0;
  min-width: 0;

  @keyframes blink {
    0% {
      background: ${p => p.theme.color.white};
    }
    50% {
      background: ${p => p.theme.color.lightGray};
    }
    0% {
      background: ${p => p.theme.color.white};
    }
  }
`

export const StyledRouteContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: calc(100vw - 64px);
`

export const SideWindowContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 40px;
  overflow: auto;
`
