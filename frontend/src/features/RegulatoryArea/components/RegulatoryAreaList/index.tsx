import { useGetRegulatoryAreasQuery } from '@api/regulatoryAreasAPI'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { Title, TitleContainer } from '@features/BackOffice/components/style'
import { MapAttributionsBox } from '@features/map/controls/MapAttributionsBox'
import { MapCoordinatesBox } from '@features/map/controls/MapCoordinatesBox'
import { MapLayer } from '@features/map/layers/MapLayer'
import { MapExtentController } from '@features/map/MapExtentController'
import { ZoomListener } from '@features/map/ZoomListener'
import { MapContainer, RegulatoryWrapper, StyledBackofficeWrapper } from '@features/RegulatoryArea/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { getTagIds } from '@utils/getTagsAsOptions'
import { getThemeIds } from '@utils/getThemesAsOptions'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { ControlPlanTable } from './ControlPlanTable'
import { RegulatoryAreaFilters } from './RegulatoryAreaFilters'
import { SeaFrontTable } from './SeaFrontTable'
import { regulatoryAreaTableActions } from './slice'
import { BaseLayerSelector } from '../BaseLayerSelector'
import { BackofficeRegulatoryAreaLayer } from '../Layers/BackofficeRegulatoryAreaLayer'
import { RegulatoryAreasPanel } from '../RegulatoryAreaPanel'

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

  const apiFilters = useMemo(
    () => ({
      seaFronts: filters.seaFronts,
      searchQuery: filters.searchQuery,
      tags: getTagIds(filters.tags),
      themes: getThemeIds(filters.themes)
    }),
    [filters.seaFronts, filters.searchQuery, filters.tags, filters.themes]
  )
  const hasNoFilters = useMemo(
    () => !apiFilters.searchQuery && apiFilters.tags?.length === 0 && apiFilters.themes?.length === 0,
    [apiFilters]
  )

  const { isFetching, isLoading } = useGetRegulatoryAreasQuery(hasNoFilters ? undefined : apiFilters)

  const closePanel = () => {
    dispatch(regulatoryAreaTableActions.setOpenRegulatoryAreaId(undefined))
  }
  const createRegulatoryArea = () => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}/new`)
  }
  const createRegulatoryAreaGroup = () => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_GROUP]}/new`)
  }

  return (
    <StyledBackofficeWrapper>
      <StyledRegulatoryWrapper>
        <StickyContainer>
          <TitleContainer>
            <Title>Zones réglementaires</Title>
            <div>
              <Button
                accent={Accent.SECONDARY}
                Icon={Icon.Plus}
                onClick={createRegulatoryAreaGroup}
                style={{ marginRight: '8px' }}
              >
                Créer un groupe de reg.
              </Button>
              <Button Icon={Icon.Plus} onClick={createRegulatoryArea}>
                Saisir une nouvelle réglementation
              </Button>
            </div>
          </TitleContainer>
          <RegulatoryAreaFilters />
        </StickyContainer>
        {filters.groupBy === 'SEA_FRONT' ? (
          <SeaFrontTable apiFilters={apiFilters} isLoading={isLoading || isFetching} />
        ) : (
          <ControlPlanTable apiFilters={apiFilters} isLoading={isLoading || isFetching} />
        )}
      </StyledRegulatoryWrapper>

      <>
        <BaseLayerSelector />
        <MapContainer>
          {[...mapChildrensComponents, <MapLayer key="MapLayer" selectedBaseLayer={selectedBaseLayer} />]}
        </MapContainer>
      </>

      {openedRegulatoryAreaId && <StyledRegulatoryAreasPanel layerId={openedRegulatoryAreaId} onClose={closePanel} />}
    </StyledBackofficeWrapper>
  )
}

const StyledRegulatoryAreasPanel = styled(RegulatoryAreasPanel)`
  left: 51%;
  top: 12px;
`

const StyledRegulatoryWrapper = styled(RegulatoryWrapper)`
  padding: 0 40px 24px;
`

const StickyContainer = styled.div`
  background: ${p => p.theme.color.white};
  position: sticky;
  top: 0;
  padding-top: 24px;
  padding-bottom: 32px;
`
