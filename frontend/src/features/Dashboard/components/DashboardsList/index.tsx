import { useGetDashboardsQuery } from '@api/dashboardsAPI'
import { SideWindowContent } from '@features/SideWindow/style'
import styled from 'styled-components'

import { DashboardsTable } from './DashboardsTable'

export function DashboardsList() {
  const { data: dashboards, isError, isFetching, isLoading } = useGetDashboardsQuery()

  return (
    <SideWindowContent>
      <StyledHeader>
        <Title>Tableaux de bord</Title>
      </StyledHeader>
      <NumberOfDisplayedDashboards>
        {dashboards?.length ?? '0'} Tableau{dashboards && dashboards.length > 1 ? 'x' : ''}
      </NumberOfDisplayedDashboards>

      {isError ? (
        <p>Erreur au chargement des données</p>
      ) : (
        <DashboardsTable dashboards={dashboards ?? []} isLoading={isLoading || isFetching} />
      )}
    </SideWindowContent>
  )
}

const Title = styled.h1`
  color: ${p => p.theme.color.gunMetal};
  font-size: 22px;
  line-height: 50px;
`
const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  margin-bottom: 40px;
`
const NumberOfDisplayedDashboards = styled.h3`
  font-size: 13px;
  margin-top: 12px;
`
