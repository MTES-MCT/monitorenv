import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { Accordion } from '../Accordion'

const AMP_LINK = '/dashboard/199-effort-de-surveillance-et-de-controle-en-amp?'
const REGULATORY_AREA_LINK = '/dashboard/216-tableau-de-bord-par-zone-reglementaire?'
const DEPARTMENT_LINK = '/dashboard/197-bilan-et-comites-de-pilotage-niveau-departement?'

export function TerritorialPressure({ isExpanded, setExpandedAccordion }) {
  const METABASE_URL = import.meta.env.FRONTEND_METABASE_URL
  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const currentYear = new Date().getFullYear()

  // Regulatory Areas link
  const regulatoryAreas = useAppSelector(state =>
    activeDashboardId ? state.dashboard.extractedArea?.regulatoryAreas : []
  )
  const regulatoryAreaIds = regulatoryAreas?.map(area => area.id)
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const regulatoryLayersByLayerName = Object.keys(
    groupBy(regulatoryAreaIds, r => regulatoryLayers?.entities[r]?.layer_name)
  )
  const encodedLinks = encodeURIComponent(regulatoryLayersByLayerName.join("&groupe_d'entité-réglementaire="))
  const formattedRegulatoryAreaLink = useMemo(
    () =>
      regulatoryLayersByLayerName
        ? encodeURIComponent(`groupe_d'entité-réglementaire=${encodedLinks}&année=${currentYear}`)
        : '',
    [regulatoryLayersByLayerName, encodedLinks, currentYear]
  )

  // AMP link
  // TODO: ask to Xavier the range date
  const dates = 'dates=2024-01-01~2024-12-31'
  const amps = useAppSelector(state => (activeDashboardId ? state.dashboard.extractedArea?.amps : []))
  const ampsByName = amps?.map(amp => amp.name)
  const formattedAmpLink = useMemo(
    () => (ampsByName ? encodeURIComponent(`amp=${ampsByName.join('&amp=')}&intervalle_de_date=${dates}`) : ''),
    [ampsByName]
  )

  // Department link
  const department = useAppSelector(state => (activeDashboardId ? state.dashboard.extractedArea?.inseeCode : undefined))
  const departmentLink = `département=${department}&année=${encodeURIComponent(currentYear)}`

  return (
    <Accordion
      isExpanded={isExpanded}
      setExpandedAccordion={setExpandedAccordion}
      title="Pression territoriale des contrôles et surveillances"
    >
      <LinksContainer>
        <a
          href={`${METABASE_URL}${REGULATORY_AREA_LINK}${formattedRegulatoryAreaLink}`}
          rel="external noreferrer"
          target="_blank"
        >
          <span>Pression zones REG</span>
          <Icon.Summary />
        </a>
        <a href={`${METABASE_URL}${AMP_LINK}${formattedAmpLink}`} rel="external noreferrer" target="_blank">
          <span>Pression zones AMP</span>
          <Icon.Summary />
        </a>
        <a href={`${METABASE_URL}${DEPARTMENT_LINK}${departmentLink}`} rel="external noreferrer" target="_blank">
          <span>Pression département</span>
          <Icon.Summary />
        </a>
      </LinksContainer>
    </Accordion>
  )
}

const LinksContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  justify-content: space-between;
  > a {
    align-items: center;
    color: #5597d2;
    display: flex;
    gap: 4px;
  }
`
