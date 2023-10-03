import { backOfficeControlUnitListActions } from './slice'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { TabBar } from '../../BackOffice/components/TabBar'

export function TabMenu() {
  const dispatch = useAppDispatch()
  const backOfficeControlUnitList = useAppSelector(store => store.backOfficeControlUnitList)

  const filterArchivedControlUnits = (isArchived: boolean) => {
    dispatch(backOfficeControlUnitListActions.setFilter({ key: 'isArchived', value: isArchived }))
  }

  return (
    <TabBar>
      <TabBar.Tab
        $isActive={!backOfficeControlUnitList.filtersState.isArchived}
        onClick={() => filterArchivedControlUnits(false)}
      >
        Unités actives
      </TabBar.Tab>
      <TabBar.Tab
        $isActive={backOfficeControlUnitList.filtersState.isArchived}
        onClick={() => filterArchivedControlUnits(true)}
      >
        Unités archivées
      </TabBar.Tab>
    </TabBar>
  )
}
