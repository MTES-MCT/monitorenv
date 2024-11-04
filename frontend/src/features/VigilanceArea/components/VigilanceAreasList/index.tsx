import { SideWindowContent } from '@features/SideWindow/style'
import { useGetFilteredVigilanceAreasQuery } from '@features/VigilanceArea/hooks/useGetFilteredVigilanceAreasQuery'
import styled from 'styled-components'

import { VigilanceAreasFilters } from './Filters'
import { VigilanceAreasTable } from './VigilanceAreasTable'

export function VigilancesAreasList() {
  const { isError, isFetching, isLoading, vigilanceAreas } = useGetFilteredVigilanceAreasQuery()

  return (
    <SideWindowContent>
      <StyledHeader>
        <Title data-cy="SideWindowHeader-title">Zones de vigilance</Title>
      </StyledHeader>
      <VigilanceAreasFilters />
      {isError ? (
        <p data-cy="listReportingWrapper">Erreur au chargement des données</p>
      ) : (
        <VigilanceAreasTable
          isLoading={isLoading || isFetching}
          vigilanceAreas={Object.values(vigilanceAreas?.entities ?? {})}
        />
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
