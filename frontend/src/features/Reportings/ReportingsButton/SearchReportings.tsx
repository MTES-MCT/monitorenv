import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'

import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setDisplayedItems } from '../../../domain/shared_slices/Global'
import { createAndOpenNewReporting } from '../../../domain/use_cases/reportings/createAndOpenNewReporting'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'
import { sideWindowActions } from '../../SideWindow/slice'

export function SearchReportings() {
  const dispatch = useDispatch()
  const {
    global: { displayReportingsLayer }
  } = useAppSelector(state => state)

  const closeSearchReportings = () => {
    dispatch(setDisplayedItems({ isSearchReportingsVisible: false }))
  }

  const setReportingsVisibilityOnMap = () => {
    dispatch(setDisplayedItems({ displayReportingsLayer: !displayReportingsLayer }))
  }

  const createReporting = () => {
    dispatch(createAndOpenNewReporting())
  }

  const toggleReportingsWindow = () => {
    dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.REPORTINGS))
  }

  return (
    <MenuWithCloseButton.Container>
      <MenuWithCloseButton.Header>
        <MenuWithCloseButton.CloseButton Icon={Icon.Close} onClick={closeSearchReportings} />
        <MenuWithCloseButton.Title>Signalements</MenuWithCloseButton.Title>

        <MenuWithCloseButton.VisibilityButton
          accent={Accent.SECONDARY}
          Icon={displayReportingsLayer ? Icon.Display : Icon.Hide}
          onClick={setReportingsVisibilityOnMap}
        />
      </MenuWithCloseButton.Header>
      <MenuWithCloseButton.Body>
        <MenuWithCloseButton.Section>
          <Button Icon={Icon.Plus} isFullWidth onClick={createReporting}>
            Ajouter un signalement
          </Button>
        </MenuWithCloseButton.Section>
        <MenuWithCloseButton.Section>
          <Button accent={Accent.SECONDARY} Icon={Icon.Expand} isFullWidth onClick={toggleReportingsWindow}>
            Voir la vue détaillée des signalements
          </Button>
        </MenuWithCloseButton.Section>
      </MenuWithCloseButton.Body>
    </MenuWithCloseButton.Container>
  )
}
