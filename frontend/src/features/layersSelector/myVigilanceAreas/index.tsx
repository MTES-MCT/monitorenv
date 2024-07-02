import { ChevronIcon } from '@features/commonStyles/icons/ChevronIcon.style'
import { VigilanceAreaFormTypeOpen, vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import styled from 'styled-components'

import { LayerSelector } from '../utils/LayerSelector.style'

export function MyVigilanceAreas() {
  const dispatch = useAppDispatch()

  const areMyVigilanceAreasOpen = useAppSelector(state => state.layerSidebar.areMyVigilanceAreasOpen)

  // TODO: Replace this with the actual data
  const savedVigilanceAreas = []

  const onTitleClicked = () => {
    dispatch(layerSidebarActions.toggleMyVigilanceAreas())
  }

  const createVigilanceArea = () => {
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.EDIT_FORM))
    dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId())
  }

  return (
    <>
      <LayerSelector.Wrapper
        $hasPinnedLayers={savedVigilanceAreas.length > 0}
        $isExpanded={areMyVigilanceAreasOpen}
        data-cy="my-vigilance-areas-layers"
        onClick={onTitleClicked}
      >
        <LayerSelector.Pin />
        <LayerSelector.Title>Mes zones de vigilance</LayerSelector.Title>
        <ChevronIcon $isOpen={areMyVigilanceAreasOpen} $right />
      </LayerSelector.Wrapper>
      {areMyVigilanceAreasOpen && (
        <>
          <ButtonContainer>
            <Button
              accent={Accent.SECONDARY}
              Icon={Icon.Plus}
              isFullWidth
              onClick={createVigilanceArea}
              title="Créer une zone de vigilance"
            >
              Créer une zone de vigilance
            </Button>
          </ButtonContainer>

          <LayerSelector.LayerList>
            {savedVigilanceAreas.length === 0 && (
              <LayerSelector.NoLayerSelected>Aucune zone sélectionnée</LayerSelector.NoLayerSelected>
            )}
          </LayerSelector.LayerList>
        </>
      )}
    </>
  )
}

const ButtonContainer = styled.div`
  background-color: ${p => p.theme.color.white};
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
  padding: 8px 16px;
`
