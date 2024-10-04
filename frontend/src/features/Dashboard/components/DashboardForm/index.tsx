import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { Dashboard } from '@features/Dashboard/types'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, OPENLAYERS_PROJECTION, Textarea, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { isNotArchived } from '@utils/isNotArchived'
import { getCenter } from 'ol/extent'
import { GeoJSON } from 'ol/format'
import { transform } from 'ol/proj'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { Accordion } from './Accordion'
import { Amps } from './Amps'
import { ControlUnits } from './ControlUnits'
import { DashboardFilters } from './Filters'
import { RegulatoryAreas } from './RegulatoryAreas'
import { Reportings } from './Reportings'
import { TerritorialPressure } from './TerritorialPressure'
import { VigilanceAreas } from './VigilanceAreas'
import { dashboardActions, getFilteredReportings } from '../../slice'

export function DashboardForm() {
  const extractedArea = useAppSelector(state => state.dashboard.extractedArea)
  const geom = useAppSelector(state => state.dashboard.geometry)

  const { data: controlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const activeControlUnits = useMemo(() => controlUnits?.filter(isNotArchived), [controlUnits])

  const firstColumnRef = useRef<HTMLDivElement>(null)
  const firstColumnWidth = firstColumnRef.current?.clientWidth

  const secondColumnRef = useRef<HTMLDivElement>(null)
  const secondColumnWidth = secondColumnRef.current?.clientWidth

  const dispatch = useAppDispatch()
  const dashboardId = 1 // TODO replace with real value
  const comments = useAppSelector(state => state.dashboard.dashboards?.[dashboardId]?.comments ?? undefined)
  const previewSelectionFilter =
    useAppSelector(state => state.dashboard.dashboards?.[dashboardId]?.filters?.previewSelection) ?? false

  const filteredReportings = useAppSelector(state => getFilteredReportings(state.dashboard))

  const [expandedAccordionFirstColumn, setExpandedAccordionFirstColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )
  const [expandedAccordionSecondColumn, setExpandedAccordionSecondColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )
  const [expandedAccordionThirdColumn, setExpandedAccordionThirdColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )

  const updateComments = (value: string | undefined) => {
    dispatch(dashboardActions.setComments(value))
  }

  const handleAccordionClick = (type: Dashboard.Block) => {
    switch (type) {
      case Dashboard.Block.REGULATORY_AREAS:
      case Dashboard.Block.AMP:
      case Dashboard.Block.VIGILANCE_AREAS:
        setExpandedAccordionFirstColumn(expandedAccordionFirstColumn === type ? undefined : type)
        dispatch(dashboardActions.setDashboardPanel())
        dispatch(dashboardActions.removeAllPreviewedItems())
        break
      case Dashboard.Block.TERRITORIAL_PRESSURE:
      case Dashboard.Block.REPORTINGS:
        setExpandedAccordionSecondColumn(expandedAccordionSecondColumn === type ? undefined : type)
        break
      case Dashboard.Block.CONTROL_UNITS:
      case Dashboard.Block.COMMENTS:
        setExpandedAccordionThirdColumn(expandedAccordionThirdColumn === type ? undefined : type)
        break
      default:
        break
    }
  }

  const coordinates = useMemo(() => {
    if (!geom) {
      return ''
    }
    const feature = new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    const center = extent && getCenter(extent)
    const centerLatLon = center && transform(center, OPENLAYERS_PROJECTION, WSG84_PROJECTION)

    if (!centerLatLon) {
      return undefined
    }

    return `${centerLatLon[1]?.toFixed(3)}/${centerLatLon[0]?.toFixed(3)}`
  }, [geom])

  // remove openedPanel on mount
  useEffect(() => {
    if (previewSelectionFilter) {
      dispatch(dashboardActions.setDashboardPanel())
      dispatch(dashboardActions.removeAllPreviewedItems())
      setExpandedAccordionFirstColumn(undefined)
      setExpandedAccordionSecondColumn(undefined)
      setExpandedAccordionThirdColumn(undefined)
      dispatch(dashboardActions.setDashboardFilters({ key: 'previewSelection', value: false }))
    }
  }, [previewSelectionFilter, dispatch])

  useEffect(() => {
    // remove openedPanel on mount
    dispatch(dashboardActions.setDashboardPanel())

    // cleanup preview on unmount
    return () => {
      dispatch(dashboardActions.removeAllPreviewedItems())
    }
  }, [dispatch])

  return (
    <>
      <DashboardFilters />
      <Container>
        <Column ref={firstColumnRef}>
          <RegulatoryAreas
            columnWidth={firstColumnWidth ?? 0}
            dashboardId={dashboardId}
            isExpanded={expandedAccordionFirstColumn === Dashboard.Block.REGULATORY_AREAS}
            isSelectedAccordionOpen={previewSelectionFilter}
            regulatoryAreas={extractedArea?.regulatoryAreas}
            setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REGULATORY_AREAS)}
          />

          <Amps
            amps={extractedArea?.amps}
            dashboardId={dashboardId}
            isExpanded={expandedAccordionFirstColumn === Dashboard.Block.AMP}
            isSelectedAccordionOpen={previewSelectionFilter}
            setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.AMP)}
          />
          <VigilanceAreas
            columnWidth={firstColumnWidth ?? 0}
            dashboardId={dashboardId}
            isExpanded={expandedAccordionFirstColumn === Dashboard.Block.VIGILANCE_AREAS}
            isSelectedAccordionOpen={previewSelectionFilter}
            setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.VIGILANCE_AREAS)}
            vigilanceAreas={extractedArea?.vigilanceAreas}
          />
        </Column>
        <Column ref={secondColumnRef}>
          <TerritorialPressure
            columnWidth={(firstColumnWidth ?? 0) + (secondColumnWidth ?? 0)}
            isExpanded={expandedAccordionSecondColumn === Dashboard.Block.TERRITORIAL_PRESSURE}
            setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.TERRITORIAL_PRESSURE)}
          />

          <Reportings
            dashboardId={dashboardId}
            isExpanded={expandedAccordionSecondColumn === Dashboard.Block.REPORTINGS}
            reportings={filteredReportings ?? []}
            setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REPORTINGS)}
          />
        </Column>
        <Column>
          <ControlUnits
            controlUnits={activeControlUnits ?? []}
            isExpanded={expandedAccordionThirdColumn === Dashboard.Block.CONTROL_UNITS}
            isSelectedAccordionOpen={previewSelectionFilter}
            setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.CONTROL_UNITS)}
          />
          <Accordion
            isExpanded={expandedAccordionThirdColumn === Dashboard.Block.COMMENTS}
            setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.COMMENTS)}
            title="Commentaires"
          >
            <StyledTextarea
              isLabelHidden
              label="Commentaires"
              name="comments"
              onChange={updateComments}
              value={comments}
            />
          </Accordion>
          <WeatherBlock>
            <WeatherTitle>Météo</WeatherTitle>
            {coordinates ? (
              <a href={`https://www.windy.com/${coordinates}`} rel="noreferrer" target="_blank">
                <span> {`https://www.windy.com/${coordinates}`}</span>
                <Icon.ExternalLink size={16} />
              </a>
            ) : (
              <CoordinatesError>Nous n&apos;avons pas pu calculer l&apos;emplacement </CoordinatesError>
            )}
          </WeatherBlock>
        </Column>
      </Container>
    </>
  )
}

const Container = styled(SideWindowContent)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  // gap and padding are 3px less than the mockup because of box-shadow is hidden because of overflow @see AccordionWrapper
  column-gap: 45px;
  padding: 21px 21px 0 21px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100vh - 48px - 24px); // 48px = navbar height, 24px = padding
  scrollbar-gutter: stable;
  overflow-y: auto;

  padding: 3px;
`
const StyledTextarea = styled(Textarea)`
  padding: 16px 24px;
`
const WeatherBlock = styled.div`
  align-items: center;
  box-shadow: 0px 3px 6px #70778540;
  display: flex;
  gap: 24px;
  padding: 21px 24px;
  > a {
    align-items: center;
    color: #295edb;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
`
const WeatherTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
`
const CoordinatesError = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-size: 11px;
  font-style: italic;
`
