import { Header, Title, TotalResults } from '@components/Table/style'
import { SideWindowContent } from '@features/SideWindow/style'
import { useGetFilteredVigilanceAreasQuery } from '@features/VigilanceArea/hooks/useGetFilteredVigilanceAreasQuery'
import { pluralize } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { VigilanceAreasFilters } from './Filters'
import { VigilanceAreasTable } from './VigilanceAreasTable'

export function VigilancesAreasList() {
  const { isError, isFetching, isLoading, vigilanceAreas } = useGetFilteredVigilanceAreasQuery()
  const vigilanceAreasResults = useMemo(
    () => vigilanceAreas.ids.map(id => vigilanceAreas.entities[id]!),
    [vigilanceAreas]
  )

  return (
    <StyledSideWindowContent>
      <Header>
        <Title data-cy="SideWindowHeader-title">Zones de vigilance</Title>
      </Header>
      <VigilanceAreasFilters />
      {isError ? (
        <p data-cy="listReportingWrapper">Erreur au chargement des données</p>
      ) : (
        <>
          <TotalResults>
            {`${vigilanceAreasResults.length ?? 0} ${pluralize(
              'zone',
              vigilanceAreasResults.length ?? 0
            )} de vigilance`}
          </TotalResults>
          <VigilanceAreasTable isFetching={isFetching} isLoading={isLoading} vigilanceAreas={vigilanceAreasResults} />
        </>
      )}
    </StyledSideWindowContent>
  )
}

const StyledSideWindowContent = styled(SideWindowContent)`
  overflow-x: inherit;
`
