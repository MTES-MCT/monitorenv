import { backOfficeAdministrationListActions } from './slice'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { TabBar } from '../../BackOffice/components/TabBar'

export function TabMenu() {
  const dispatch = useAppDispatch()
  const backOfficeAdministrationList = useAppSelector(store => store.backOfficeAdministrationList)

  const filterArchivedAdministrations = (isArchived: boolean) => {
    dispatch(backOfficeAdministrationListActions.setFilter({ key: 'isArchived', value: isArchived }))
  }

  return (
    <TabBar>
      <TabBar.Tab
        $isActive={!backOfficeAdministrationList.filtersState.isArchived}
        onClick={() => filterArchivedAdministrations(false)}
      >
        Administrations actives
      </TabBar.Tab>
      <TabBar.Tab
        $isActive={backOfficeAdministrationList.filtersState.isArchived}
        onClick={() => filterArchivedAdministrations(true)}
      >
        Administrations archivées
      </TabBar.Tab>
    </TabBar>
  )
}
