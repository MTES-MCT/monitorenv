import { Icon, MapMenuDialog } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { HtmlHTMLAttributes } from 'react'
import type { Promisable } from 'type-fest'

export type DialogProps = HtmlHTMLAttributes<HTMLDivElement> & {
  isCloseButtonHidden?: boolean
  onClose: () => Promisable<void>
  title: string
}
export function OverlayCard({ children, isCloseButtonHidden = false, onClose, title }: DialogProps) {
  return (
    <StyledMapMenuDialogContainer>
      <MapMenuDialog.Header>
        <StyledMapMenuDialogTitle>{title}</StyledMapMenuDialogTitle>
        <MapMenuDialog.CloseButton
          Icon={Icon.Close}
          onClick={onClose}
          style={{ visibility: isCloseButtonHidden ? 'hidden' : 'visible' }}
        />
      </MapMenuDialog.Header>
      {children}
    </StyledMapMenuDialogContainer>
  )
}

const StyledMapMenuDialogContainer = styled(MapMenuDialog.Container)`
  margin: 0;
`

const StyledMapMenuDialogTitle = styled(MapMenuDialog.Title)`
  flex-grow: 1;
  margin-left: 32px;
  text-align: center;
`
