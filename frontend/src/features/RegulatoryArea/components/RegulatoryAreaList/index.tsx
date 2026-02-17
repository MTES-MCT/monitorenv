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
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { ControlPlanTable } from './ControlPlanTable'
import { RegulatoryAreaFilters } from './RegulatoryAreaFilters'
import { SeaFrontTable } from './SeaFrontTable'
import { regulatoryAreaTableActions } from './slice'
import { BaseLayerSelector } from '../BaseLayerSelector'
import { BackofficeRegulatoryAreaLayer } from '../Layers/BackofficeRegulatoryAreaLayer'

const mapChildrensComponents = [
  // @ts-ignore
  <ZoomListener key="ZoomListener" />,
  <MapAttributionsBox key="MapAttributionsBox" />,
  // @ts-ignore
  <MapCoordinatesBox key="MapCoordinatesBox" />,
  // @ts-ignore
  <BackofficeRegulatoryAreaLayer key="BackofficeRegulatoryAreaLayer" />,
  // @ts-ignore
  <MapExtentController key="MapExtentController" />
]

export function RegulatoryAreaList() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const filters = useAppSelector(state => state.regulatoryAreaTable.filtersState)
  const openedRegulatoryAreaId = useAppSelector(state => state.regulatoryAreaTable.openedRegulatoryAreaId)
  const selectedBaseLayer = useAppSelector(state => state.regulatoryAreaBo.selectedBaseLayer)

  const formattedTagIds = useMemo(
    () => filters.tags?.flatMap(tag => [tag.id, ...(tag.subTags?.map(subTag => subTag.id) ?? [])]),
    [filters.tags]
  )

  const formattedThemeIds = useMemo(
    () => filters.themes?.flatMap(theme => [theme.id, ...(theme.subThemes?.map(subTheme => subTheme.id) ?? [])]),
    [filters.themes]
  )

  const apiFilters = useMemo(
    () => ({
      seaFronts: filters.seaFronts,
      searchQuery: filters.searchQuery,
      tags: formattedTagIds,

      themes: formattedThemeIds
    }),
    [filters.seaFronts, filters.searchQuery, formattedTagIds, formattedThemeIds]
  )
  useGetRegulatoryAreasQuery(apiFilters)

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
          {filters.groupBy === 'SEA_FRONT' ? (
            <SeaFrontTable apiFilters={apiFilters} />
          ) : (
            <ControlPlanTable apiFilters={apiFilters} />
          )}
        </RegulatoryWrapper>

        <>
          <BaseLayerSelector />
          <MapContainer>
            {[...mapChildrensComponents, <MapLayer key="MapLayer" selectedBaseLayer={selectedBaseLayer} />]}
          </MapContainer>
        </>

        {openedRegulatoryAreaId && (
          <StyledRegulatoryAreasPanel isNewRegulatoryArea layerId={openedRegulatoryAreaId} onClose={closePanel} />
        )}
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
