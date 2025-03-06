import { StyledMapMenuDialogContainer, StyledMapMenuDialogTitle } from '@components/style'
import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { reduceReportingFormOnMap } from '@features/Reportings/useCases/reduceReportingFormOnMap'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, MapMenuDialog, Size } from '@mtes-mct/monitor-ui'
import { globalActions } from 'domain/shared_slices/Global'
import styled from 'styled-components'

import { DistinctionFilters } from './DistinctionFilters'
import { RecentActivityFilters } from './RecentActivityFilters'

export function RecentActivityMenuButton() {
  const dispatch = useAppDispatch()
  const isRecentActivityDialogVisible = useAppSelector(state => state.global.visibility.isRecentActivityDialogVisible)
  const displayRecentActivityLayer = useAppSelector(state => state.global.layers.displayRecentActivityLayer)
  const withoutDistinction = useAppSelector(state => state.recentActivity.distinctionFilter === 'WITHOUT_DISTINCTION')
  const toggleRecentActivityDialog = e => {
    e.preventDefault()

    dispatch(globalActions.hideAllDialogs())
    dispatch(reduceReportingFormOnMap())
    dispatch(
      globalActions.setDisplayedItems({ visibility: { isRecentActivityDialogVisible: !isRecentActivityDialogVisible } })
    )
  }
  const closeModal = () => {
    dispatch(globalActions.setDisplayedItems({ visibility: { isRecentActivityDialogVisible: false } }))
  }

  const handleRecentActivityVisibility = () => {
    dispatch(globalActions.setDisplayedItems({ layers: { displayRecentActivityLayer: !displayRecentActivityLayer } }))
  }

  return (
    <>
      {isRecentActivityDialogVisible && (
        <div>
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
            <MapMenuDialog.Body>
              <RecentActivityFilters />
            </MapMenuDialog.Body>
            <DistinctionFiltersContainer $withSmallBottomMargin={withoutDistinction}>
              <DistinctionFilters />
            </DistinctionFiltersContainer>
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

const DistinctionFiltersContainer = styled(MapMenuDialog.Container)<{ $withSmallBottomMargin: boolean }>`
  display: flex;
  position: absolute;
  margin-top: 16px;
  bottom: ${p => (p.$withSmallBottomMargin ? '-59px' : '-138px')};
`
