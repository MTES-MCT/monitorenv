import styled from 'styled-components'

import { Tab } from './Tab'

const BareTabBar = styled.div`
  display: flex;
  width: 100%;

  > button:first-child {
    margin-left: 0;
  }
`

export const TabBar = Object.assign(BareTabBar, {
  Tab
})
