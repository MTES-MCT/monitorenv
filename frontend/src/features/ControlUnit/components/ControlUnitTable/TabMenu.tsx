import { controlUnitTableActions } from './slice'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { BackOfficeTabBar } from '../../../BackOffice/components/BackOfficeTabBar'

export function TabMenu() {
  const dispatch = useAppDispatch()
  const backOfficeControlUnitList = useAppSelector(store => store.backOfficeControlUnitList)

  const filterArchivedControlUnits = (isArchived: boolean) => {
    dispatch(controlUnitTableActions.setFilter({ key: 'isArchived', value: isArchived }))
  }

  return (
    <BackOfficeTabBar>
      <BackOfficeTabBar.Tab
        $isActive={!backOfficeControlUnitList.filtersState.isArchived}
        onClick={() => filterArchivedControlUnits(false)}
      >
        Unités actives
      </BackOfficeTabBar.Tab>
      <BackOfficeTabBar.Tab
        $isActive={backOfficeControlUnitList.filtersState.isArchived}
        onClick={() => filterArchivedControlUnits(true)}
      >
        Unités archivées
      </BackOfficeTabBar.Tab>
    </BackOfficeTabBar>
  )
}
