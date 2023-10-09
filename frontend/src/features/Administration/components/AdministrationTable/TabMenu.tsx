import { administrationTableActions } from './slice'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { BackOfficeTabBar } from '../../../BackOffice/components/BackOfficeTabBar'

export function TabMenu() {
  const dispatch = useAppDispatch()
  const backOfficeAdministrationList = useAppSelector(store => store.backOfficeAdministrationList)

  const filterArchivedAdministrations = (isArchived: boolean) => {
    dispatch(administrationTableActions.setFilter({ key: 'isArchived', value: isArchived }))
  }

  return (
    <BackOfficeTabBar>
      <BackOfficeTabBar.Tab
        $isActive={!backOfficeAdministrationList.filtersState.isArchived}
        onClick={() => filterArchivedAdministrations(false)}
      >
        Administrations actives
      </BackOfficeTabBar.Tab>
      <BackOfficeTabBar.Tab
        $isActive={backOfficeAdministrationList.filtersState.isArchived}
        onClick={() => filterArchivedAdministrations(true)}
      >
        Administrations archivées
      </BackOfficeTabBar.Tab>
    </BackOfficeTabBar>
  )
}
