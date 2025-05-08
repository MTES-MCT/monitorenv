import { Tooltip } from '@components/Tooltip'
import { dashboardActions, getActiveDashboardId } from '@features/Dashboard/slice'
import { hideLayersAndSidebar } from '@features/Dashboard/useCases/hideLayersAndSidebar'
import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, pluralize, THEME, Toggle } from '@mtes-mct/monitor-ui'
import { resetState } from 'domain/shared_slices/Global'
import { forwardRef } from 'react'
import styled from 'styled-components'

import { Accordion, Title } from '../Accordion'
import { Filters } from './Filters'
import { SelectedAccordion } from '../SelectedAccordion'

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

    const mapFocus = useAppSelector(state => state.dashboard.mapFocus)

    const updateMapFocus = (checked: boolean) => {
      dispatch(dashboardActions.setMapFocus(checked))
      if (checked) {
        dispatch(hideLayersAndSidebar())
        dispatch(closeMetadataPanel())
      } else {
        dispatch(resetState())
      }
    }

    const titleWithTooltip = (
      <TitleContainer>
        {mapFocus && <Icon.AttentionFilled color={THEME.color.blueGray} />}
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
              checked={mapFocus ?? false}
              isLabelHidden
              label="Focus cartographique"
              name="mapFocus"
              onChange={updateMapFocus}
            />
            <>
              <span>Focus cartographique sur l&apos;activité récente du brief</span>
              <Tooltip isSideWindow>
                Le focus cartographie permet de ne montrer que la zone du brief et l&apos;activité récente. Il cache
                tous les autres éléments épinglés (zones réglementaires, de vigilance, signalements, etc.) et les autres
                éléments potentiellement affichés sur la carte (signalements, missions, unités, nuage de point, etc.)
              </Tooltip>
            </>
          </StyledToggle>
          {mapFocus && (
            <MapFocusInfo>
              <Icon.AttentionFilled color={THEME.color.blueGray} />
              <span>La carte n&apos;est filtrée que sur l&apos;activité récente du brief</span>
            </MapFocusInfo>
          )}
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
const MapFocusInfo = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
  padding: 8px 24px 0px 24px;
  > span {
    color: ${p => p.theme.color.blueGray};
  }
`
