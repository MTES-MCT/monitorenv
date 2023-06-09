import { Accent, CustomSearch, Icon, Search } from '@mtes-mct/monitor-ui'
import { GeoJSON } from 'ol/format'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useGetSemaphoresQuery } from '../../../api/semaphoresAPI'
import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map/constants'
import { setDisplayedItems } from '../../../domain/shared_slices/Global'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { addSemaphore, setSelectedSemaphore } from '../../../domain/shared_slices/SemaphoresSlice'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'

export function SearchSemaphores() {
  const dispatch = useDispatch()

  const { displaySemaphoresLayer } = useAppSelector(state => state.global)
  const { semaphoresResearchHistory } = useAppSelector(state => state.semaphoresSlice)
  const { data } = useGetSemaphoresQuery()

  const [isSemaphoresHistoryVisible, setIsSemaphoresHistoryVisible] = useState(semaphoresResearchHistory.length > 0)
  const optionsRef = useRef(data?.map(semaphore => ({ label: semaphore.unit || semaphore.name, value: semaphore })))
  const customSearchRef = useRef(
    new CustomSearch(optionsRef.current || [], ['value.name', 'value.unit'], { isStrict: true })
  )

  const setSemaphoreVisibilityOnMap = () => {
    dispatch(setDisplayedItems({ displaySemaphoresLayer: !displaySemaphoresLayer, missionsMenuIsOpen: false }))
  }
  const closeSearchSemaphore = () => {
    dispatch(setDisplayedItems({ isSearchSemaphoreVisible: false }))
  }

  const handleQuerySemaphore = () => {
    setIsSemaphoresHistoryVisible(false)
  }
  const onClose = () => {
    setIsSemaphoresHistoryVisible(true)
  }
  const handleSelectSemaphore = selectedSemaphore => {
    if (selectedSemaphore) {
      dispatch(addSemaphore(selectedSemaphore))
      dispatch(setSelectedSemaphore(selectedSemaphore.id))
      zoomOnSemaphore(selectedSemaphore.geom)
    }
  }

  const selectRegiteredSemaphore = selectedRegisteredSemaphore => {
    dispatch(setSelectedSemaphore(selectedRegisteredSemaphore.id))
    zoomOnSemaphore(selectedRegisteredSemaphore.geom)
  }

  const zoomOnSemaphore = geom => {
    const feature = new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    dispatch(setFitToExtent(extent))
  }

  return (
    <MenuWithCloseButton.Container>
      <MenuWithCloseButton.Header>
        <MenuWithCloseButton.CloseButton Icon={Icon.Close} onClick={closeSearchSemaphore} />
        <MenuWithCloseButton.Title>Sémaphores</MenuWithCloseButton.Title>

        <MenuWithCloseButton.VisibilityButton
          accent={Accent.SECONDARY}
          Icon={displaySemaphoresLayer ? Icon.Display : Icon.Hide}
          onClick={setSemaphoreVisibilityOnMap}
        />
      </MenuWithCloseButton.Header>

      <StyledSearch
        customSearch={customSearchRef.current}
        isLabelHidden
        isLight
        label="Rechercher un sémaphore"
        name="search-semaphore"
        onChange={handleSelectSemaphore}
        onClose={onClose}
        onQuery={handleQuerySemaphore}
        options={optionsRef.current}
        optionValueKey={'name' as any}
        placeholder="Rechercher un sémaphore"
      />

      {isSemaphoresHistoryVisible && (
        <StyledRegisteredSemaphoreList>
          <StyledHistoricTitle>Historique de recherche</StyledHistoricTitle>
          {semaphoresResearchHistory.map(semaphore => (
            <StyledRegisteredSemaphore key={semaphore.id} onClick={() => selectRegiteredSemaphore(semaphore)}>
              {semaphore.unit || semaphore.name}
            </StyledRegisteredSemaphore>
          ))}
        </StyledRegisteredSemaphoreList>
      )}
    </MenuWithCloseButton.Container>
  )
}

const StyledSearch = styled(Search)`
  .rs-picker-menu {
    width: 100%;
  }
`

const StyledRegisteredSemaphoreList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  border-top: 1px solid ${p => p.theme.color.lightGray};
`

const StyledHistoricTitle = styled.span`
  color: ${p => p.theme.color.slateGray};
  padding: 16px 16px 0px 16px;
  font-size: 11px;
`

const StyledRegisteredSemaphore = styled.button`
  background-color: ${p => p.theme.color.white};
  color: ${p => p.theme.color.gunMetal};
  font: normal normal medium 13px/18px Marianne;
  padding-left: 16px;
  padding-right: 16px;
  text-align: initial;
  width: 100%;

  &:last-child {
    padding-bottom: 16px;
  }
`
