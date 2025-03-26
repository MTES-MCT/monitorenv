import { Tooltip } from '@components/Tooltip'
import { getActiveDashboardId, getFilteredAmps, getFilteredRegulatoryAreas } from '@features/Dashboard/slice'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon } from '@mtes-mct/monitor-ui'
import { forwardRef, useMemo } from 'react'
import styled from 'styled-components'

import { Accordion, Title } from '../Accordion'

// Id like 199, 216, 197 can be changes if dashboards in metabase changes
const AMP_LINK = '/dashboard/199-effort-de-surveillance-et-de-controle-en-amp?'
const REGULATORY_AREA_LINK = '/dashboard/216-tableau-de-bord-par-zone-reglementaire?'
const DEPARTMENT_LINK = '/dashboard/197-bilan-et-comites-de-pilotage-niveau-departement?'
const METABASE_URL = import.meta.env.FRONTEND_METABASE_URL

type TerritorialPressureProps = {
  isExpanded: boolean
  setExpandedAccordion: () => void
}

export const TerritorialPressure = forwardRef<HTMLDivElement, TerritorialPressureProps>(
  ({ isExpanded, setExpandedAccordion }, ref) => {
    const activeDashboardId = useAppSelector(state => getActiveDashboardId(state.dashboard))

    const currentYear = new Date().getFullYear()
    const dateRange = `${currentYear}-01-01~${currentYear}-12-31`
    const filters = useAppSelector(state =>
      activeDashboardId ? state.dashboardFilters?.dashboards[activeDashboardId]?.filters : undefined
    )

    // Regulatory Areas link
    const filteredRegulatoryAreas = useAppSelector(state =>
      getFilteredRegulatoryAreas(state.dashboard, filters?.regulatoryTags)
    )
    const regulatoryAreaIds = filteredRegulatoryAreas?.map(area => area.id)
    const formattedRegulatoryAreaLink = useMemo(
      () =>
        regulatoryAreaIds
          ? `groupe_d'entit%25C3%25A9s_r%25C3%25A9glementaires=&id=${regulatoryAreaIds.join(
              '&id='
            )}&intervalle_de_dates=${dateRange}`
          : '',
      [regulatoryAreaIds, dateRange]
    )

    // AMP link
    const filteredAmps = useAppSelector(state => getFilteredAmps(state.dashboard, filters?.amps))
    const ampsByName = filteredAmps?.map(amp => amp.id)
    const formattedAmpLink = useMemo(
      () => (ampsByName ? `id=${ampsByName.join('&id=')}&intervalle_de_dates=${dateRange}&amp=` : ''),
      [ampsByName, dateRange]
    )

    // Department link
    const department = useAppSelector(state =>
      activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.extractedArea?.inseeCode : undefined
    )

    const titleWithTooltip = (
      <TitleContainer>
        <Title>Pression territoriale des contrôles et surveillances</Title>
        <Tooltip isSideWindow>
          Les liens suivants envoient vers des tableaux Metabase montrant la pression territoriale sur les zones REG,
          les AMP ou à l’échelle du département.
        </Tooltip>
      </TitleContainer>
    )

    return (
      <Accordion
        isExpanded={isExpanded}
        name="Pression territoriale des contrôles et surveillances"
        setExpandedAccordion={setExpandedAccordion}
        title={titleWithTooltip}
        titleRef={ref}
      >
        <LinksContainer>
          {filteredRegulatoryAreas && filteredRegulatoryAreas.length > 0 && (
            <a
              href={`${METABASE_URL}${REGULATORY_AREA_LINK}${formattedRegulatoryAreaLink}`}
              rel="external noreferrer"
              target="_blank"
            >
              <span>Pression zones REG</span>
              <Icon.ExternalLink size={16} />
            </a>
          )}
          {filteredAmps && filteredAmps.length > 0 && (
            <a href={`${METABASE_URL}${AMP_LINK}${formattedAmpLink}`} rel="external noreferrer" target="_blank">
              <span>Pression zones AMP</span>
              <Icon.ExternalLink size={16} />
            </a>
          )}
          {department && (
            <a
              href={`${METABASE_URL}${DEPARTMENT_LINK}&dates=${dateRange}&d%25C3%25A9partement=${department}`}
              rel="external noreferrer"
              target="_blank"
            >
              <span>Pression département</span>
              <Icon.ExternalLink size={16} />
            </a>
          )}
        </LinksContainer>
      </Accordion>
    )
  }
)

const LinksContainer = styled.div`
  align-items: center;
  display: flex;
  padding: 16px 24px;
  justify-content: space-between;
  > a {
    align-items: center;
    color: #295edb;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
`
const TitleContainer = styled.div`
  display: flex;
  gap: 8px;
`
