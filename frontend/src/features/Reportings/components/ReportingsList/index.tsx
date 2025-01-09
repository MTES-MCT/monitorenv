import { ReportingsFilters } from '@features/Reportings/Filters'
import { useGetFilteredReportingsQuery } from '@features/Reportings/hooks/useGetFilteredReportingsQuery'
import { addReporting } from '@features/Reportings/useCases/addReporting'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import { ReportingContext } from 'domain/shared_slices/Global'
import styled from 'styled-components'

import { ReportingsTable } from './ReportingsTable'

export function ReportingsList() {
  const dispatch = useAppDispatch()

  const { isError, isFetching, isLoading, reportings } = useGetFilteredReportingsQuery()
  const { isLoading: isControlPlansLoading } = useGetControlPlans()

  const createReporting = () => {
    dispatch(addReporting(ReportingContext.SIDE_WINDOW))
  }

  return (
    <SideWindowContent>
      <StyledHeader>
        <Title data-cy="SideWindowHeader-title">Signalements</Title>
        <StyledButton Icon={Icon.Plus} onClick={createReporting}>
          Ajouter un nouveau signalement
        </StyledButton>
      </StyledHeader>
      {isControlPlansLoading ? <div>Chargement</div> : <ReportingsFilters />}

      {isError ? (
        <p data-cy="listReportingWrapper">Erreur au chargement des données</p>
      ) : (
        <ReportingsTable isFetching={isFetching} isLoading={isLoading} reportings={reportings} />
      )}
    </SideWindowContent>
  )
}

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  margin-bottom: 32px;
`

const Title = styled.h1`
  color: ${p => p.theme.color.gunMetal};
  font-size: 22px;
  line-height: 50px;
`

const StyledButton = styled(Button)`
  align-self: center;
`
