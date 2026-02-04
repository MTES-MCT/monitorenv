import styled from 'styled-components'

export const VesselIdentity = styled.dl`
  background-color: ${p => p.theme.color.white};
  display: grid;
  flex-wrap: wrap;
  gap: 4px 8px;
  grid-template-columns: 1fr 1fr 1.5fr 1.5fr;
  padding: 16px 20px;

  dt {
    color: ${p => p.theme.color.slateGray};
    font-weight: 400;
  }

  dd {
    color: ${p => p.theme.color.gunMetal};
    font-weight: 500;
    margin: 0 0 auto 0;
  }
`
