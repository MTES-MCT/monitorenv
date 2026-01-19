import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { RegulatoryAreasPanel } from '@components/RegulatoryArea/RegulatoryAreasPanel'
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
  const groupFilter = useAppSelector(state => state.regulatoryAreaTable.filtersState.groupingType)
  const openedRegulatoryAreaId = useAppSelector(state => state.regulatoryAreaTable.openedRegulatoryAreaId)

  useGetRegulatoryLayersQuery()

  const closePanel = () => {
    dispatch(regulatoryAreaTableActions.setOpenRegulatoryAreaId(undefined))
  }

  return (
    <>
      <StyledBackofficeWrapper>
        <RegulatoryWrapper>
          <TitleContainer>
            <Title>Zones réglementaires</Title>
            <Button Icon={Icon.Plus}> Saisir une nouvelle réglementation</Button>
          </TitleContainer>
          <RegulatoryAreaFilters />
          {groupFilter === 'SEA_FRONT' ? <SeaFrontTable /> : <ControlPlanTable />}
        </RegulatoryWrapper>

        <MapContainer>{childrensComponents}</MapContainer>

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
