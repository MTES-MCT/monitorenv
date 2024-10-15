import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, THEME } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { Accordion } from '../Accordion'

// Id like 199, 216, 197 can be changes if dashboards in metabase changes
const AMP_LINK = '/dashboard/199-effort-de-surveillance-et-de-controle-en-amp?'
const REGULATORY_AREA_LINK = '/dashboard/216-tableau-de-bord-par-zone-reglementaire?'
const DEPARTMENT_LINK = '/dashboard/197-bilan-et-comites-de-pilotage-niveau-departement?'
const METABASE_URL = import.meta.env.FRONTEND_METABASE_URL

type TerritorialPressureProps = {
  isExpanded: boolean
  setExpandedAccordion: () => void
}

export function TerritorialPressure({ isExpanded, setExpandedAccordion }: TerritorialPressureProps) {
  const ref = useRef<HTMLDivElement>(null)
  const refLeftPosition = ref.current?.getBoundingClientRect().left ?? 0

  const [isVisibleTooltip, setIsVisibleTooltip] = useState<boolean>(false)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const currentYear = new Date().getFullYear()
  const dateRange = `${currentYear}-01-01~${currentYear}-12-31`

  // Regulatory Areas link
  const regulatoryAreas = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.extractedArea?.regulatoryAreas : []
  )
  const regulatoryAreaIds = regulatoryAreas?.map(area => area.id)
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const regulatoryLayersByLayerName = Object.keys(
    groupBy(regulatoryAreaIds, r => regulatoryLayers?.entities[r]?.layer_name)
  )
  const mappedLinks = regulatoryLayersByLayerName.join("&groupe_d'entit%25C3%25A9-r%25C3%25A9glementaires=")
  const formattedRegulatoryAreaLink = useMemo(
    () =>
      regulatoryLayersByLayerName
        ? `groupe_d'entit%25C3%25A9-r%25C3%25A9glementaires=${mappedLinks}&ann%25C3%25A9e=${currentYear}`
        : '',
    [regulatoryLayersByLayerName, mappedLinks, currentYear]
  )

  // AMP link
  const amps = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.extractedArea?.amps : []
  )
  const ampsByName = amps?.map(amp => amp.id)
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
      <span>Pression territoriale des contrôles et surveillances</span>
      <>
        <div ref={ref}>
          <Icon.Info
            aria-describedby="territorialPressureTooltip"
            color={THEME.color.slateGray}
            onBlur={() => setIsVisibleTooltip(false)}
            onFocus={() => setIsVisibleTooltip(true)}
            onMouseLeave={() => setIsVisibleTooltip(false)}
            onMouseOver={() => setIsVisibleTooltip(true)}
            tabIndex={0}
          />
        </div>
        {isVisibleTooltip && (
          <StyledTooltip $marginLeft={refLeftPosition} id="territorialPressureTooltip" role="tooltip">
            Les liens suivants envoient vers des tableaux Metabase montrant la pression territoriale sur les zones REG,
            les AMP ou à l’échelle du département.
          </StyledTooltip>
        )}
      </>
    </TitleContainer>
  )

  return (
    <Accordion
      isExpanded={isExpanded}
      name="Pression territoriale des contrôles et surveillances"
      setExpandedAccordion={setExpandedAccordion}
      title={titleWithTooltip}
    >
      <LinksContainer>
        {regulatoryAreas && regulatoryAreas.length > 0 && (
          <a
            href={`${METABASE_URL}${REGULATORY_AREA_LINK}${formattedRegulatoryAreaLink}`}
            rel="external noreferrer"
            target="_blank"
          >
            <span>Pression zones REG</span>
            <Icon.ExternalLink size={16} />
          </a>
        )}
        {amps && amps.length > 0 && (
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

const StyledTooltip = styled.p<{ $marginLeft: number }>`
  background: ${p => p.theme.color.cultured};
  border: ${p => p.theme.color.lightGray} 1px solid;
  box-shadow: 0px 3px 6px ${p => p.theme.color.slateGray};
  font-size: 11px;
  padding: 4px 8px;
  position: absolute;
  left: calc(${p => p.$marginLeft}px + 30px);
  width: 310px;
  z-index: 2;
`
