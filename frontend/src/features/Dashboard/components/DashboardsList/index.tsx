import { TotalResults } from '@components/Table/style'
import { useGetFilteredDashboardsQuery } from '@features/Dashboard/hooks/useGetFilteredDashboardsQuery'
import { dashboardActions } from '@features/Dashboard/slice'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { DashboardsTable } from './DashboardsTable'
import { Filters } from './Filters'
import { setDisplayedItems } from '../../../../domain/shared_slices/Global'

export function DashboardsList() {
  const { dashboards, isError, isFetching, isLoading } = useGetFilteredDashboardsQuery()
  const dispatch = useAppDispatch()
  const createDashboard = () => {
    dispatch(
      setDisplayedItems({
        visibility: { isDashboardDialogVisible: true }
      })
    )
    dispatch(dashboardActions.setIsDrawing(true))
  }

  return (
    <SideWindowContent>
      <StyledHeader>
        <Title>Tableaux de bord</Title>
        <Button Icon={Icon.Plus} onClick={createDashboard}>
          Ajouter un tableau de bord
        </Button>
      </StyledHeader>
      <Filters key="dashboard-filters-list" />
      <StyledTotalResults>
        {dashboards?.length ?? '0'} Tableau{dashboards && dashboards.length > 1 ? 'x' : ''}
      </StyledTotalResults>

      {isError ? (
        <p>Erreur au chargement des données</p>
      ) : (
        <DashboardsTable dashboards={dashboards ?? []} isFetching={isFetching} isLoading={isLoading} />
      )}
    </SideWindowContent>
  )
}

const Title = styled.h1`
  color: ${p => p.theme.color.gunMetal};
  font-size: 22px;
  line-height: 50px;
`
const StyledHeader = styled.header`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 40px;
`
const StyledTotalResults = styled(TotalResults)`
  margin-bottom: 8px;
`
