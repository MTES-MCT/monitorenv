import styled from 'styled-components'

import { Tab } from './Tab'

const BareBackOfficeTabBar = styled.div`
  display: flex;
  width: 100%;

  > button:first-child {
    margin-left: 0;
  }
`

export const BackOfficeTabBar = Object.assign(BareBackOfficeTabBar, {
  Tab
})
