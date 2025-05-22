import { useGetNearbyUnitsQuery } from '@api/nearbyUnitsAPI'
import { Tooltip } from '@components/Tooltip'
import { ResultList } from '@features/Dashboard/components/DashboardForm/ControlUnits'
import { Item } from '@features/Dashboard/components/DashboardForm/NearbyUnits/Item'
import { getDatesFromFilters } from '@features/Dashboard/components/DashboardForm/NearbyUnits/utils'
import { SelectedAccordion } from '@features/Dashboard/components/DashboardForm/SelectedAccordion'
import { getNearbyUnitFilters } from '@features/Dashboard/components/DashboardForm/slice'
import { SelectedLayerList } from '@features/Dashboard/components/DashboardForm/style'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'

import { Accordion, Title, TitleContainer } from '../Accordion'
import { Filters } from './Filters'

import type { GeoJSON } from '../../../../../domain/types/GeoJSON'

type NearbyUnitsProps = {
  geometry: GeoJSON.Geometry
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  setExpandedAccordion: () => void
}
export const NearbyUnits = forwardRef<HTMLDivElement, NearbyUnitsProps>(
  ({ geometry, isExpanded, isSelectedAccordionOpen, setExpandedAccordion }, ref) => {
    const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

    const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
    const selectedNearbyUnits = useAppSelector(state =>
      activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.selectedNearbyUnits : []
    )
    const nearbyUnitFilters = useAppSelector(state => getNearbyUnitFilters(state.dashboardFilters, activeDashboardId))

    const { from, to } = getDatesFromFilters({
      from: nearbyUnitFilters?.from,
      periodFilter: nearbyUnitFilters?.periodFilter,
      to: nearbyUnitFilters?.to
    })
    const { data: nearbyUnits } = useGetNearbyUnitsQuery({ from, geometry, to })

    useEffect(() => {
      if (isSelectedAccordionOpen) {
        setExpandedSelectedAccordion(isSelectedAccordionOpen)
      }
    }, [isSelectedAccordionOpen])

    const hasChildren = (nearbyUnits?.length ?? 0) > 1

    return (
      <div>
        <StyledAccordion
          isExpanded={isExpanded}
          name="nearbyUnits"
          setExpandedAccordion={setExpandedAccordion}
          title={
            <TitleContainer>
              <Title>Unités proches</Title>
              <Tooltip isSideWindow>
                Les unités présentes dans la liste sont celles qui ont au moins une surveillance ou un contrôle dans la
                zone du brief. Vous pouvez sélectionner celles de vos choix à l&apos;aide des filtres de période.
              </Tooltip>
            </TitleContainer>
          }
          titleRef={ref}
        >
          <Wrapper>
            <StyledFilters
              $isExpanded={isExpanded}
              hasChildren={hasChildren}
              nearbyUnits={nearbyUnits}
              selectedNearbyUnits={selectedNearbyUnits}
            />
            <ResultList $hasResults>
              {Object.values(nearbyUnits ?? [])
                .sort((a, b) => (a.controlUnit.name > b.controlUnit.name ? 1 : -1))
                .map(nearbyUnit => (
                  <Item key={nearbyUnit.controlUnit.id} nearbyUnit={nearbyUnit} />
                ))}
            </ResultList>
          </Wrapper>
        </StyledAccordion>
        <SelectedAccordion
          isExpanded={isExpandedSelectedAccordion}
          isReadOnly={selectedNearbyUnits?.length === 0}
          setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
          title={`${selectedNearbyUnits?.length} ${pluralize('unité', selectedNearbyUnits?.length ?? 0)} ${pluralize(
            'proche',
            selectedNearbyUnits?.length ?? 0
          )} ${pluralize('sélectionnée', selectedNearbyUnits?.length ?? 0)} `}
        >
          <SelectedLayerList>
            {selectedNearbyUnits?.map(nearbyUnit => (
              <Item key={nearbyUnit.controlUnit.id} isSelected nearbyUnit={nearbyUnit} />
            ))}
          </SelectedLayerList>
        </SelectedAccordion>
      </div>
    )
  }
)

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
`

const StyledFilters = styled(Filters)<{ $isExpanded: boolean }>`
  transition-delay: ${({ $isExpanded }) => ($isExpanded ? '0.3s' : '0')};
`

const StyledAccordion = styled(Accordion)<{ isExpanded: boolean }>`
  > div > div {
    overflow: ${p => (p.isExpanded ? 'inherit' : 'hidden')};
  }
`
