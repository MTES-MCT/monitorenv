import { useGetRegulatoryAreasQuery } from '@api/regulatoryAreasAPI'
import { RegulatoryAreasPanel } from '@components/RegulatoryArea/RegulatoryAreasPanel'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { Title } from '@features/BackOffice/components/style'
import { MapAttributionsBox } from '@features/map/controls/MapAttributionsBox'
import { MapCoordinatesBox } from '@features/map/controls/MapCoordinatesBox'
import { MapLayer } from '@features/map/layers/MapLayer'
import { MapExtentController } from '@features/map/MapExtentController'
import { ZoomListener } from '@features/map/ZoomListener'
import { MapContainer, RegulatoryWrapper, StyledBackofficeWrapper } from '@features/RegulatoryArea/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { ControlPlanTable } from './ControlPlanTable'
import { RegulatoryAreaFilters } from './RegulatoryAreaFilters'
import { SeaFrontTable } from './SeaFrontTable'
import { regulatoryAreaTableActions } from './slice'
import { BackofficeRegulatoryAreaLayer } from '../Layers/BackofficeRegulatoryAreaLayer'

const childrensComponents = [
  // @ts-ignore
  <ZoomListener key="ZoomListener" />,
  <MapAttributionsBox key="MapAttributionsBox" />,
  // @ts-ignore
  <MapCoordinatesBox key="MapCoordinatesBox" />,
  // @ts-ignore
  <BackofficeRegulatoryAreaLayer key="BackofficeRegulatoryAreaLayer" />,
  // @ts-ignore
  <MapExtentController key="MapExtentController" />,
  <MapLayer key="MapLayer" />
]
export function RegulatoryAreaList() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const filters = useAppSelector(state => state.regulatoryAreaTable.filtersState)
  const openedRegulatoryAreaId = useAppSelector(state => state.regulatoryAreaTable.openedRegulatoryAreaId)

  useGetRegulatoryAreasQuery({
    groupBy: filters.groupBy,
    seaFronts: filters.seaFronts,
    searchQuery: filters.searchQuery,
    tags: filters.tags?.map(tag => tag.id),
    themes: filters.themes?.map(theme => theme.id)
  })

  const closePanel = () => {
    dispatch(regulatoryAreaTableActions.setOpenRegulatoryAreaId(undefined))
  }
  const createRegulatoryArea = () => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}/new`)
  }

  return (
    <>
      <StyledBackofficeWrapper>
        <RegulatoryWrapper>
          <TitleContainer>
            <Title>Zones réglementaires</Title>
            <Button Icon={Icon.Plus} onClick={createRegulatoryArea}>
              Saisir une nouvelle réglementation
            </Button>
          </TitleContainer>
          <RegulatoryAreaFilters />
          {filters.groupBy === 'SEA_FRONT' ? <SeaFrontTable /> : <ControlPlanTable />}
        </RegulatoryWrapper>

        <MapContainer className="map-container">{childrensComponents}</MapContainer>

        {openedRegulatoryAreaId && <StyledRegulatoryAreasPanel layerId={openedRegulatoryAreaId} onClose={closePanel} />}
      </StyledBackofficeWrapper>
    </>
  )
}

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${p => p.theme.color.gainsboro};

  > Button {
    align-self: start;
  }
`
const StyledRegulatoryAreasPanel = styled(RegulatoryAreasPanel)`
  left: 53%;
  top: 24px;
`
