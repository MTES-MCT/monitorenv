import { ChevronIcon } from '@features/commonStyles/icons/ChevronIcon.style'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import styled from 'styled-components'

import { MyVigilanceAreaLayerZone } from './MyVigilanceAreaLayerZone'
import { LayerSelector } from '../utils/LayerSelector.style'

export function MyVigilanceAreas() {
  const dispatch = useAppDispatch()

  const myVigilanceAreasIsOpen = useAppSelector(state => state.layerSidebar.myVigilanceAreasIsOpen)
  const myVigilanceAreaIds = useAppSelector(state => state.vigilanceArea.myVigilanceAreaIds)

  const onTitleClicked = () => {
    dispatch(layerSidebarActions.toggleMyVigilanceAreas())
  }

  const createVigilanceArea = () => {
    dispatch(vigilanceAreaActions.createVigilanceArea())
  }

  return (
    <>
      <LayerSelector.Wrapper
        $hasPinnedLayers={myVigilanceAreaIds.length > 0}
        $isExpanded={myVigilanceAreasIsOpen}
        data-cy="my-vigilance-areas-layers"
        onClick={onTitleClicked}
      >
        <LayerSelector.Pin />
        <LayerSelector.Title>Mes zones de vigilance</LayerSelector.Title>
        <ChevronIcon $isOpen={myVigilanceAreasIsOpen} $right />
      </LayerSelector.Wrapper>
      {myVigilanceAreasIsOpen && (
        <>
          <ButtonContainer $withPaddingBottom={myVigilanceAreaIds.length > 0}>
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

          <LayerSelector.LayerList data-cy="my-vigilance-area-zones-list">
            {myVigilanceAreaIds.length === 0 ? (
              <LayerSelector.NoLayerSelected>Aucune zone sélectionnée</LayerSelector.NoLayerSelected>
            ) : (
              myVigilanceAreaIds.map(id => <MyVigilanceAreaLayerZone key={id} layerId={id} />)
            )}
          </LayerSelector.LayerList>
        </>
      )}
    </>
  )
}

const ButtonContainer = styled.div<{ $withPaddingBottom: boolean }>`
  background-color: ${p => p.theme.color.white};
  padding: 8px 16px ${p => (p.$withPaddingBottom ? ' 16px' : '0px')} 16px;
`
