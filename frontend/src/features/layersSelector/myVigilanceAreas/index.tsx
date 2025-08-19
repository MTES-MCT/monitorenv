import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { InlineTransparentButton } from '@components/style'
import { ChevronIconButton } from '@features/commonStyles/icons/ChevronIconButton'
import { sideWindowActions } from '@features/SideWindow/slice'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMountTransition } from '@hooks/useMountTransition'
import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import styled from 'styled-components'

import { MyVigilanceAreaLayerZone } from './MyVigilanceAreaLayerZone'
import { LayerSelector } from '../utils/LayerSelector.style'

export function MyVigilanceAreas() {
  const dispatch = useAppDispatch()
  const isSuperUser = useAppSelector(state => state.account.isSuperUser)

  const { data: vigilanceAreas } = useGetVigilanceAreasQuery()

  const draftVigilanceAreas = Object.values(vigilanceAreas?.entities ?? {})
    ?.filter(vigilanceArea => vigilanceArea?.isDraft)
    .sort((a, b) => a?.name?.localeCompare(b?.name))

  const myVigilanceAreasIsOpen = useAppSelector(state => state.layerSidebar.myVigilanceAreasIsOpen)
  const myVigilanceAreaIds = useAppSelector(state => state.vigilanceArea.myVigilanceAreaIds)

  const onTitleClicked = () => {
    dispatch(layerSidebarActions.toggleMyVigilanceAreas())
  }

  const createVigilanceArea = () => {
    dispatch(vigilanceAreaActions.createVigilanceArea())
  }

  const gotToVigilanceAreasList = () => {
    dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.VIGILANCE_AREAS))
  }

  const hasTransition = useMountTransition(myVigilanceAreasIsOpen, 500)

  return (
    <>
      <LayerSelector.Wrapper $hasPinnedLayers={myVigilanceAreaIds.length > 0} data-cy="my-vigilance-areas-layers">
        <InlineTransparentButton onClick={onTitleClicked}>
          <LayerSelector.Pin />
          <LayerSelector.Title>Mes zones de vigilance</LayerSelector.Title>
        </InlineTransparentButton>
        <ChevronIconButton $isOpen={myVigilanceAreasIsOpen} onClick={onTitleClicked} />
      </LayerSelector.Wrapper>
      {(hasTransition || myVigilanceAreasIsOpen) && (
        <Wrapper $isExpanded={hasTransition && myVigilanceAreasIsOpen}>
          {myVigilanceAreaIds.length === 0 && (
            <LayerSelector.NoLayerSelected data-cy="my-vigilance-area-no-result">
              Aucune zone sélectionnée
            </LayerSelector.NoLayerSelected>
          )}

          {myVigilanceAreaIds.length > 0 && (
            <LayerSelector.LayerList
              $baseLayersLength={myVigilanceAreaIds.length}
              $maxHeight={draftVigilanceAreas.length > 3 ? 24 : undefined}
              $showBaseLayers={hasTransition && myVigilanceAreasIsOpen}
              data-cy="my-vigilance-area-zones-list"
            >
              {myVigilanceAreaIds.map(id => (
                <MyVigilanceAreaLayerZone key={id} layerId={id} pinnedVigilanceArea />
              ))}
            </LayerSelector.LayerList>
          )}

          {draftVigilanceAreas.length > 0 && isSuperUser && (
            <>
              <DraftVigilanceAreaTitle>Zones non publiées</DraftVigilanceAreaTitle>
              <LayerSelector.LayerList
                $baseLayersLength={draftVigilanceAreas.length}
                $showBaseLayers={hasTransition && myVigilanceAreasIsOpen}
                $withoutScroll
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
        </Wrapper>
      )}

      {(hasTransition || myVigilanceAreasIsOpen) && isSuperUser && (
        <ButtonContainer>
          <Button Icon={Icon.Plus} isFullWidth onClick={createVigilanceArea} title="Créer une zone de vigilance">
            Créer une zone de vigilance
          </Button>
          <Button
            accent={Accent.SECONDARY}
            Icon={Icon.Expand}
            isFullWidth
            onClick={gotToVigilanceAreasList}
            title="Voir la vue détaillée des zones de vigilance"
          >
            Voir la vue détaillée des zones de vigilance
          </Button>
        </ButtonContainer>
      )}
    </>
  )
}

const ButtonContainer = styled.div`
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 16px 8px 16px;
`

const DraftVigilanceAreaTitle = styled.div`
  background-color: ${p => p.theme.color.white};
  border-top: 2px solid ${p => p.theme.color.lightGray};
  color: ${p => p.theme.color.charcoal};
  font-weight: bold;
  padding: 8px 20px;
`

const Wrapper = styled.div<{ $isExpanded: boolean }>`
  max-height: ${p => (p.$isExpanded ? '50vh' : '0')};
  transition: 0.5s all;
  overflow-x: hidden;
  overflow-y: auto;
`
