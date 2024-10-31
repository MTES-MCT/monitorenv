import { useGetDashboardsQuery } from '@api/dashboardsAPI'
import { TotalResults } from '@components/Table/style'
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
      <StyledTotalResults>
        {dashboards?.length ?? '0'} Tableau{dashboards && dashboards.length > 1 ? 'x' : ''}
      </StyledTotalResults>

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
const StyledTotalResults = styled(TotalResults)`
  margin-bottom: 8px;
`
