import { Button, MapMenuDialog } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const Italic = styled.div`
  font-style: italic;
`

export const Bold = styled.span`
  font-weight: 700;
`

export const StyledMapMenuDialogContainer = styled(MapMenuDialog.Container)`
  display: flex;
  margin-left: -6px;
  position: absolute;
  transform: translateX(-100%);
`

// TODO delete when Monitor-ui component have good padding
export const DialogButton = styled(Button)`
  padding: 4px 12px;
`

export const DialogSeparator = styled.div`
  height: 1px;
  border-top: 1px solid ${p => p.theme.color.gainsboro};
  margin-left: -12px;
  margin-right: -12px;
`
