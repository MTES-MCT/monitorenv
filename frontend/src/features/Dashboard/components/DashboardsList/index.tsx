import { SideWindowContent } from '@features/SideWindow/style'
import styled from 'styled-components'

import { DashboardForm } from '../DashboardForm'

export function DashboardsList() {
  return (
    <SideWindowContent>
      <Title>Tableaux de bord</Title>
      <DashboardForm />
    </SideWindowContent>
  )
}

const Title = styled.h1`
  color: ${p => p.theme.color.gunMetal};
  font-size: 22px;
  line-height: 50px;
`
