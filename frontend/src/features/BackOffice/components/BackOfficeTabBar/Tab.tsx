import styled from 'styled-components'

export type TabProps = {
  $isActive?: boolean
}
export const Tab = styled.button.attrs<TabProps>(props => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'aria-selected': !!props.$isActive,
  role: 'tab'
}))<TabProps>`
  background-color: transparent;
  border: 0;
  border-bottom: solid 5px ${p => (p.$isActive ? p.theme.color.charcoal : p.theme.color.white)};
  color: ${p => p.theme.color.gunMetal};
  font-size: 18px;
  font-weight: 700;
  padding: 0 0 5px;
  margin: 0 10px 30px;
`
