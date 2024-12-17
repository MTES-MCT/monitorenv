import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
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
  const { data: vigilanceAreas } = useGetVigilanceAreasQuery()

  const draftVigilanceAreas = Object.values(vigilanceAreas?.entities ?? {})?.filter(
    vigilanceArea => vigilanceArea?.isDraft
  )

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

      <>
        <LayerSelector.LayerList
          $baseLayersLength={myVigilanceAreaIds.length}
          $maxHeight={draftVigilanceAreas.length > 3 ? 24 : undefined}
          $showBaseLayers={myVigilanceAreasIsOpen}
          data-cy="my-vigilance-area-zones-list"
        >
          {myVigilanceAreaIds.length === 0 ? (
            <LayerSelector.NoLayerSelected>Aucune zone sélectionnée</LayerSelector.NoLayerSelected>
          ) : (
            myVigilanceAreaIds.map(id => <MyVigilanceAreaLayerZone key={id} layerId={id} pinnedVigilanceArea />)
          )}
        </LayerSelector.LayerList>
        {myVigilanceAreasIsOpen && draftVigilanceAreas.length > 0 && (
          <>
            <DraftVigilanceAreaTitle>Zones non publiées</DraftVigilanceAreaTitle>
            <LayerSelector.LayerList
              $baseLayersLength={draftVigilanceAreas.length}
              $showBaseLayers={myVigilanceAreasIsOpen}
              data-cy="draft-vigilance-area-zones-list"
            >
              {draftVigilanceAreas?.map(vigilanceArea => {
                if (!vigilanceArea?.id) {
                  return null
                }

                return <MyVigilanceAreaLayerZone key={vigilanceArea?.id} layerId={vigilanceArea?.id} />
              })}
            </LayerSelector.LayerList>
          </>
        )}

        {myVigilanceAreasIsOpen && (
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
        )}
      </>
    </>
  )
}

const ButtonContainer = styled.div`
  background-color: ${p => p.theme.color.white};
  padding: 8px 16px 8px 16px;
`

const DraftVigilanceAreaTitle = styled.div`
  background-color: ${p => p.theme.color.white};
  border-top: 2px solid ${p => p.theme.color.lightGray};
  color: ${p => p.theme.color.charcoal};
  font-weight: bold;
  padding: 8px 20px;
`
