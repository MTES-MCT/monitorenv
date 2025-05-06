import { StyledMapMenuDialogContainer, StyledMapMenuDialogTitle } from '@components/style'
import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { recentActivityActions } from '@features/RecentActivity/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, MapMenuDialog, Size } from '@mtes-mct/monitor-ui'
import { globalActions } from 'domain/shared_slices/Global'
import styled from 'styled-components'

import { DrawZone } from './DrawZone'
import { RecentActivityFilters } from './RecentActivityFilters'
import { RecentActivityLegend } from '../RecentActivityLegend'

import type { MenuButtonProps } from '@components/Menu'

export function RecentActivityMenuButton({ onClickMenuButton, onVisibiltyChange }: MenuButtonProps) {
  const dispatch = useAppDispatch()
  const isRecentActivityDialogVisible = useAppSelector(state => state.global.visibility.isRecentActivityDialogVisible)
  const displayRecentActivityLayer = useAppSelector(state => state.global.layers.displayRecentActivityLayer)
  const isDrawing = useAppSelector(state => state.recentActivity.isDrawing)

  const toggleRecentActivityDialog = e => {
    e.preventDefault()
    onClickMenuButton()
    if (isRecentActivityDialogVisible && !displayRecentActivityLayer) {
      dispatch(recentActivityActions.setIsLegenOpen(false))
    }
    dispatch(
      globalActions.setDisplayedItems({ visibility: { isRecentActivityDialogVisible: !isRecentActivityDialogVisible } })
    )
  }
  const closeModal = () => {
    dispatch(globalActions.setDisplayedItems({ visibility: { isRecentActivityDialogVisible: false } }))
    dispatch(recentActivityActions.setIsLegenOpen(false))
  }

  const handleRecentActivityVisibility = () => {
    onVisibiltyChange('displayRecentActivityLayer')
    dispatch(recentActivityActions.resetControlListOverlay())
  }

  return (
    <>
      {isRecentActivityDialogVisible && (
        <div>
          <RecentActivityLegend location="INSIDE" />
          <MapMenuDialogContainer>
            <MapMenuDialog.Header>
              <CloseButton Icon={Icon.Close} onClick={closeModal} />
              <StyledMapMenuDialogTitle as="h2">Activité récente</StyledMapMenuDialogTitle>
              <MapMenuDialog.VisibilityButton
                accent={Accent.SECONDARY}
                Icon={displayRecentActivityLayer ? Icon.Display : Icon.Hide}
                onClick={handleRecentActivityVisibility}
              />
            </MapMenuDialog.Header>
            {isDrawing ? (
              <StyledDrawZone />
            ) : (
              <MapMenuDialog.Body>
                <RecentActivityFilters />
              </MapMenuDialog.Body>
            )}
          </MapMenuDialogContainer>
        </div>
      )}
      <MenuWithCloseButton.ButtonOnMap
        className={isRecentActivityDialogVisible ? '_active' : undefined}
        Icon={Icon.MeasureBrokenLine}
        onClick={toggleRecentActivityDialog}
        size={Size.LARGE}
        title="Voir l'activité récente"
      />
    </>
  )
}
const MapMenuDialogContainer = styled(StyledMapMenuDialogContainer)`
  max-height: 480px;
`

const CloseButton = styled(MapMenuDialog.CloseButton)`
  margin: auto 0;
`

const StyledDrawZone = styled(DrawZone)`
  margin-top: 2px;
`
