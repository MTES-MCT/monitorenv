import { useGetSemaphoresQuery } from '@api/semaphoresAPI'
import { StyledMapMenuDialogContainer } from '@components/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, CustomSearch, Icon, MapMenuDialog, Search, Size } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { addSemaphore, setSelectedSemaphore } from 'domain/shared_slices/SemaphoresSlice'
import { reduce } from 'lodash-es'
import { useRef, useState } from 'react'
import styled from 'styled-components'

import type { Semaphore } from 'domain/entities/semaphore'

export function SearchSemaphores({ onVisibiltyChange }: { onVisibiltyChange: (layerName: string) => void }) {
  const dispatch = useAppDispatch()

  const displaySemaphoresLayer = useAppSelector(state => state.global.layers.displaySemaphoresLayer)
  const semaphoresResearchHistory = useAppSelector(state => state.semaphoresSlice.semaphoresResearchHistory)
  const { data } = useGetSemaphoresQuery()

  const [isSemaphoresHistoryVisible, setIsSemaphoresHistoryVisible] = useState(semaphoresResearchHistory.length > 0)
  const optionsRef = useRef(
    reduce(
      data?.entities,
      (options, semaphore) => {
        if (semaphore) {
          options.push({ label: semaphore.unit ?? semaphore.name, value: semaphore })
        }

        return options
      },
      [] as { label: string; value: Semaphore }[]
    ).sort((a, b) => a.label.localeCompare(b.label))
  )
  const customSearchRef = useRef(
    new CustomSearch(structuredClone(optionsRef.current || []), ['value.name', 'value.unit'], { isStrict: true })
  )

  const setSemaphoreVisibilityOnMap = () => {
    onVisibiltyChange('displaySemaphoresLayer')
  }

  const closeSearchSemaphore = () => {
    dispatch(setDisplayedItems({ visibility: { isSearchSemaphoreVisible: false } }))
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

  const selectRegisteredSemaphore = selectedRegisteredSemaphore => {
    dispatch(setSelectedSemaphore(selectedRegisteredSemaphore.id))
    zoomOnSemaphore(selectedRegisteredSemaphore.geom)
  }

  const zoomOnSemaphore = geom => {
    const feature = getFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }
  }

  return (
    <StyledMapMenuDialogContainer>
      <MapMenuDialog.Header>
        <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={closeSearchSemaphore} />
        <MapMenuDialog.Title>Sémaphores</MapMenuDialog.Title>

        <MapMenuDialog.VisibilityButton
          accent={Accent.SECONDARY}
          Icon={displaySemaphoresLayer ? Icon.Display : Icon.Hide}
          onClick={setSemaphoreVisibilityOnMap}
        />
      </MapMenuDialog.Header>

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
        optionValueKey="name"
        placeholder="Rechercher un sémaphore"
        size={Size.LARGE}
      />

      {isSemaphoresHistoryVisible && (
        <StyledRegisteredSemaphoreList>
          <StyledHistoricTitle>Historique de recherche</StyledHistoricTitle>
          {semaphoresResearchHistory.map(semaphore => (
            <StyledRegisteredSemaphore key={semaphore.id} onClick={() => selectRegisteredSemaphore(semaphore)}>
              {semaphore.unit ?? semaphore.name}
            </StyledRegisteredSemaphore>
          ))}
        </StyledRegisteredSemaphoreList>
      )}
    </StyledMapMenuDialogContainer>
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
