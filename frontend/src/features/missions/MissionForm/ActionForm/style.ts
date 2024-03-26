import { Button, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 32px;
`

export const TitleWithIcon = styled.div`
  align-items: end;
  display: flex;
  gap: 8px;
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
export const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 48px;
  padding-top: 12px:
`
