import { Button, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const Header = styled.div`
  align-items: center;

  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`

export const TitleWithIcon = styled.div`
  align-items: end;
  display: flex;
  gap: 8px;
`
export const Title = styled.h2`
  color: ${p => p.theme.color.charcoal};
  display: inline-block;
  font-size: 16px;
  line-height: 22px;
`

export const StyledDeleteButton = styled(Button)`
  > div > svg {
    color: ${p => p.theme.color.maximumRed};
  }
`
export const StyledDeleteIconButton = styled(IconButton)`
  > div > svg {
    color: ${p => p.theme.color.maximumRed};
  }
`
