import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { Accordion } from '../Accordion'

// Id like 199, 216, 197 can be changes if dashboards in metabase changes
const AMP_LINK = '/dashboard/199-effort-de-surveillance-et-de-controle-en-amp?'
const REGULATORY_AREA_LINK = '/dashboard/216-tableau-de-bord-par-zone-reglementaire?'
const DEPARTMENT_LINK = '/dashboard/197-bilan-et-comites-de-pilotage-niveau-departement?'

export function TerritorialPressure({ isExpanded, setExpandedAccordion }) {
  const METABASE_URL = import.meta.env.FRONTEND_METABASE_URL
  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const currentYear = new Date().getFullYear()
  const dates = `${currentYear}-01-01~${currentYear}-12-31`

  // Regulatory Areas link
  const regulatoryAreas = useAppSelector(state =>
    activeDashboardId ? state.dashboard.extractedArea?.regulatoryAreas : []
  )
  const regulatoryAreaIds = regulatoryAreas?.map(area => area.id)
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const regulatoryLayersByLayerName = Object.keys(
    groupBy(regulatoryAreaIds, r => regulatoryLayers?.entities[r]?.layer_name)
  )
  const mappedLinks = regulatoryLayersByLayerName.join("&groupe_d'entité-réglementaires=")
  const formattedRegulatoryAreaLink = useMemo(
    () => (regulatoryLayersByLayerName ? `groupe_d'entité-réglementaires=${mappedLinks}&année=${currentYear}` : ''),
    [regulatoryLayersByLayerName, mappedLinks, currentYear]
  )

  // AMP link
  const amps = useAppSelector(state => (activeDashboardId ? state.dashboard.extractedArea?.amps : []))
  const ampsByName = amps?.map(amp => amp.id)
  const formattedAmpLink = useMemo(
    () => (ampsByName ? `id=${ampsByName.join('&id=')}&intervalle_de_dates=${dates}&amp=` : ''),
    [ampsByName, dates]
  )

  // Department link
  const department = useAppSelector(state => (activeDashboardId ? state.dashboard.extractedArea?.inseeCode : undefined))

  return (
    <Accordion
      isExpanded={isExpanded}
      setExpandedAccordion={setExpandedAccordion}
      title="Pression territoriale des contrôles et surveillances"
    >
      <LinksContainer>
        {regulatoryAreas && regulatoryAreas.length > 0 && (
          <a
            href={`${METABASE_URL}${REGULATORY_AREA_LINK}${formattedRegulatoryAreaLink}`}
            rel="external noreferrer"
            target="_blank"
          >
            <span>Pression zones REG</span>
            <Icon.Summary />
          </a>
        )}
        {amps && amps.length > 0 && (
          <a href={`${METABASE_URL}${AMP_LINK}${formattedAmpLink}`} rel="external noreferrer" target="_blank">
            <span>Pression zones AMP</span>
            <Icon.Summary />
          </a>
        )}
        {department && (
          <a
            href={`${METABASE_URL}${DEPARTMENT_LINK}&dates=${dates}&département=${department}`}
            rel="external noreferrer"
            target="_blank"
          >
            <span>Pression département</span>
            <Icon.Summary />
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
    color: #5597d2;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
`
