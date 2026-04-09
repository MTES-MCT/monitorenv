import { TotalResults } from '@components/Table/style'
import { SideWindowContent } from '@features/SideWindow/style'
import { useGetFilteredVigilanceAreasQuery } from '@features/VigilanceArea/hooks/useGetFilteredVigilanceAreasQuery'
import { pluralize } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { VigilanceAreasFilters } from './Filters'
import { VigilanceAreasTable } from './VigilanceAreasTable'

export function VigilancesAreasList() {
  const { isError, isFetching, isLoading, vigilanceAreas } = useGetFilteredVigilanceAreasQuery()

  const vigilanceAreasResults = Object.values(vigilanceAreas?.entities ?? {})

  return (
    <StyledSideWindowContent>
      <StyledHeader>
        <Title data-cy="SideWindowHeader-title">Zones de vigilance</Title>
      </StyledHeader>
      <VigilanceAreasFilters />
      {isError ? (
        <p data-cy="listReportingWrapper">Erreur au chargement des données</p>
      ) : (
        <>
          <TotalResults>{`${vigilanceAreasResults.length ?? 0} ${pluralize(
            'zone',
            vigilanceAreasResults.length ?? 0
          )} de vigilance`}</TotalResults>
          <VigilanceAreasTable isFetching={isFetching} isLoading={isLoading} vigilanceAreas={vigilanceAreasResults} />
        </>
      )}
    </StyledSideWindowContent>
  )
}

const StyledSideWindowContent = styled(SideWindowContent)`
  overflow-x: inherit;
`
const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 32px;
`

const Title = styled.h1`
  color: ${p => p.theme.color.gunMetal};
  font-size: 22px;
  border-bottom: 1px solid ${p => p.theme.color.gainsboro};
`
