import { Tooltip } from '@components/Tooltip'
import { getActiveDashboardId } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize, Toggle } from '@mtes-mct/monitor-ui'
import { forwardRef } from 'react'
import styled from 'styled-components'

import { Accordion, Title } from '../Accordion'
import { Filters } from './Filters'
import { SelectedAccordion } from '../SelectedAccordion'
import { dashboardFiltersActions, getRecentActivityFilters } from '../slice'

type RecentActivityProps = {
  isExpanded: boolean
  setExpandedAccordion: () => void
}

export const DashboardRecentActivity = forwardRef<HTMLDivElement, RecentActivityProps>(
  ({ isExpanded, setExpandedAccordion }, ref) => {
    const dispatch = useAppDispatch()
    const activeDashboardId = useAppSelector(state => getActiveDashboardId(state.dashboard))
    const totalOfControls =
      useAppSelector(state =>
        activeDashboardId ? state.dashboard.dashboards[activeDashboardId]?.totalOfControls : 0
      ) ?? 0

    const recentActivityFilters = useAppSelector(state =>
      getRecentActivityFilters(state.dashboardFilters, activeDashboardId)
    )

    const updateMapFocus = (checked: boolean) => {
      dispatch(
        dashboardFiltersActions.setRecentActivityFilters({
          filters: { mapFocus: checked },
          id: activeDashboardId
        })
      )
    }

    const titleWithTooltip = (
      <TitleContainer>
        <Title>Activité récente</Title>
        <Tooltip isSideWindow>
          Affiche la pression territoriale de la zone du brief pour la période, les unités et thématiques sélectionnées
        </Tooltip>
      </TitleContainer>
    )

    return (
      <div>
        <StyledAccordion
          isExpanded={isExpanded}
          name="Activité récente"
          setExpandedAccordion={setExpandedAccordion}
          title={titleWithTooltip}
          titleRef={ref}
        >
          <StyledToggle>
            <Toggle
              checked={recentActivityFilters?.mapFocus ?? false}
              isLabelHidden
              label="Focus cartographique"
              name="mapFocus"
              onChange={updateMapFocus}
            />
            <>
              <span>Focus cartographique</span>
              <Tooltip isSideWindow>
                Le focus cartographie permet de ne montrer que la zone du brief et l&apos;activité récente. Il cache
                tous les autres éléments (zones réglementaires, de vigilance, signalements, etc.)
              </Tooltip>
            </>
          </StyledToggle>
          <Filters />
        </StyledAccordion>
        <SelectedAccordion
          isExpanded={false}
          isReadOnly
          title={`${totalOfControls} ${pluralize('contrôle', totalOfControls)} `}
        />
      </div>
    )
  }
)
const TitleContainer = styled.div`
  display: flex;
  gap: 8px;
`
export const StyledToggle = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
  padding: 16px 24px 0px 24px;
`
const StyledAccordion = styled(Accordion)<{ isExpanded: boolean }>`
  > div > div {
    overflow: ${p => (p.isExpanded ? 'inherit' : 'hidden')};
  }
`
