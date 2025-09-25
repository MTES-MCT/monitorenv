import { administrationTableActions } from './slice'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { BackOfficeTabBar } from '../../../BackOffice/components/BackOfficeTabBar'

export function TabMenu() {
  const dispatch = useAppDispatch()
  const administrationTable = useAppSelector(store => store.administrationTable)

  const filterArchivedAdministrations = (isArchived: boolean) => {
    dispatch(administrationTableActions.setFilter({ key: 'isArchived', value: isArchived }))
  }

  return (
    <BackOfficeTabBar role="tablist">
      <BackOfficeTabBar.Tab
        $isActive={!administrationTable.filtersState.isArchived}
        onClick={() => filterArchivedAdministrations(false)}
      >
        Administrations actives
      </BackOfficeTabBar.Tab>
      <BackOfficeTabBar.Tab
        $isActive={administrationTable.filtersState.isArchived}
        onClick={() => filterArchivedAdministrations(true)}
      >
        Administrations archivées
      </BackOfficeTabBar.Tab>
    </BackOfficeTabBar>
  )
}
