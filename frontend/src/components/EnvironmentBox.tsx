import { THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const EnvironmentBanner = styled.div`
  background-color: ${p => p.theme.color.goldenPoppy};
  color: ${p => p.theme.color.charcoal};
  display: flex;
  font-size: 12px;
  font-weight: 500;
  justify-content: space-between;
  padding-left: 4px;
  padding-right: 4px;
  position: absolute;
  top: 0px;
  width: 100%;
  z-index: 10000;
`

export function getEnvironmentBorderStyle(isEnvironmentBoxVisible: boolean) {
  return `
   border: ${isEnvironmentBoxVisible ? '4px' : '0'} solid ${THEME.color.goldenPoppy};
   border-top: ${isEnvironmentBoxVisible ? '6px' : '0'} solid ${THEME.color.goldenPoppy};
  `
}
