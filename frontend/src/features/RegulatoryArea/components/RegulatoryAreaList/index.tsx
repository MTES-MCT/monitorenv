import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { RegulatoryAreasPanel } from '@components/RegulatoryArea/RegulatoryAreasPanel'
import { BackofficeWrapper, Title } from '@features/BackOffice/components/style'
import { BaseMap } from '@features/map/BaseMap'
import { MapAttributionsBox } from '@features/map/controls/MapAttributionsBox'
import { MapCoordinatesBox } from '@features/map/controls/MapCoordinatesBox'
import { MapLayer } from '@features/map/layers/MapLayer'
import { MapExtentController } from '@features/map/MapExtentController'
import { ZoomListener } from '@features/map/ZoomListener'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ControlPlanTable } from './ControlPlanTable'
import { RegulatoryAreaFilters } from './RegulatoryAreaFilters'
import { SeaFrontTable } from './SeaFrontTable'
import { regulatoryAreaTableActions } from './slice'
import { BackofficeRegulatoryAreaListLayer } from '../Layers/BackofficeRegulatoryAreaListLayer'

const childrensComponents = [
  // @ts-ignore
  <ZoomListener key="ZoomListener" />,
  <MapAttributionsBox key="MapAttributionsBox" />,
  // @ts-ignore
  <MapCoordinatesBox key="MapCoordinatesBox" />,
  // @ts-ignore
  <BackofficeRegulatoryAreaListLayer key="BackofficeRegulatoryAreaListLayer" />,
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

const StyledBackofficeWrapper = styled(BackofficeWrapper)`
  display: flex;
  flex-direction: row;
  padding: 0px 0px 0px 24px;
  position: relative;
`

const RegulatoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px;
  width: 50%;
`
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
const MapContainer = styled(BaseMap)`
  width: 50%;
`
